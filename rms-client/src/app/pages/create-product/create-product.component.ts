import { Component } from '@angular/core';
import Stepper from 'bs-stepper';
import { post } from 'src/app/interfaces/post.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PostServices } from 'src/app/services/posts.services';
import { FormControl, FormGroup,FormArray,Validators, FormBuilder } from '@angular/forms';
import { AuthServices } from 'src/app/services/auth.services';
import { ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared-services';
import { CategoryServices } from 'src/app/services/category.services';
import { faArrowLeft,faTrash,faImage } from '@fortawesome/free-solid-svg-icons'
import { ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styles: [
  ]
})
export class CreateProductComponent {
[x: string]: any;
  userid :any
  postid:any
  private stepper!: Stepper;
  categories:any[]=[]
  labelList:any[]=[]
  subLabelList:any[]=[]
  newSubCategory :string=''
  backArrow = faArrowLeft
  trashImage = faTrash
  editImage = faImage
  isError = false

  imageIndex:number=0


  @ViewChild('addimage') addimageModal:any;

  constructor(private formBuilder:FormBuilder,private postService:PostServices,private router:Router,
  private authServices:AuthServices,private activeRoute:ActivatedRoute,private sharedSerivices:SharedServices,
  private categoryServices:CategoryServices,private modalServices:NgbModal){
    activeRoute.queryParams.subscribe((params)=>{
      if(params['postid'])
      {
        this.postid = params['postid']
      }
    })

  }

  form = new FormGroup({
    postName: new FormControl("", Validators.required),
    AdditionalName:new FormControl("",Validators.required),
    description: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    label:new FormControl("",Validators.required),
    sublabel:new FormControl("",Validators.required),
    ratings :new FormControl("",Validators.required),
    date: new FormControl("",),
    tag:new FormControl(""),
    tags: new FormArray([]),
    subCategory:new FormControl(""),
    subCategories: new FormControl(),
    image:new FormControl(""),
    images: new FormArray([])
  });

  ngOnInit() {
    const stepperElement = document.querySelector('#stepper1');
    if (stepperElement) {  // Check if stepperElement is not null
      this.stepper = new Stepper(stepperElement, {
        linear: false,
        animation: true,
      });
    } else {
      console.error('Stepper element not found');
    }
    this.userid = this.authServices.getLoggeduserId();
    this.categoryServices.getAllCategory().subscribe((data)=>{
      this.categories = data;
    })
    this.getPostDetailsForUpdate()
  }

  back()
  {
    this.sharedSerivices.navigateToPreviousPage()
  }
  

  next() {
    this.stepper.next();
  }
  prev() {
    this.stepper.previous();
  }

  async onSubmit() {
    const formData = new FormData();
    const imagesArray = this.form.get("images") as FormArray;
    const imageBlobs = imagesArray.controls.map(control => {
      const imageFile = control.get('image')?.value;
      return imageFile;
    });
    const base64Images = await Promise.all(imageBlobs.map(file => this.fileToBase64(file)));  
    const formObj = this.form.value as any;
    formObj["id"] = crypto.randomUUID();
    formObj["userid"] = this.userid;
    formObj["images"] = base64Images;
    formObj["tags"] = this.convertArrayToString(this.form.get("tags") as FormArray);
    formObj["subcategory"] = this.form.get('label')?.value+";"+this.form.get('sublabel')?.value
    console.log(formObj)
    Object.keys(formObj).forEach(key => {
      formData.append(key, JSON.stringify(formObj[key]));
    });  
    console.log(formData)
    if(this.postid)
    { 
      this.postService.updatePostById(this.postid,formData).subscribe((val)=>{
        Swal.fire({
          text: 'Updated Post!',
          icon: 'success'
        });
        setTimeout(() => {
          this.router.navigateByUrl('/profile');
        });
      })
    }
    else{
      this.postService.createOGPost(formData).subscribe((val) => {
        Swal.fire({
          text: 'Success!',
          icon: 'success'
        });
        setTimeout(() => {
          this.router.navigateByUrl('/');
        });
      });
    }
  
    return true;
  }

  onSelectCategory(value:string)
  {
    this.form.patchValue({
      category:value
    })
  }

  onSelectLabel(value:string)
  {
    this.form.patchValue({
      label:value
    })
  }

  onSelectSubLabel(value:string)
  {
    this.form.patchValue({
      sublabel:value
    })
  }

  getTags()
  {
    return this.form.get("tags") as FormArray
  }
  addTags()
  {
      const tag = new FormControl(this.form.value.tag)
      const tags = this.form.get("tags") as FormArray
      if(tags.length === 10)
      {
        this.isError = true
      }
      else{
      this.isError = false
      tags.push(tag)
      this.form.controls.tag.reset()
      }
  }
  removeTag(index:number)
  {
    this.form.controls.tags.removeAt(index)
  }

  onKeydownTag(event:any)
  {
    if(event.key === "Enter")
    {
      event.preventDefault();
      this.addTags()
    }
  }

  getImages()
  {
    return this.form.get("images") as FormArray;
  }

  

  addImage() {
    const imageGroup = this.formBuilder.group({
      image: [''],
      preview: [''],
    });
    (this.form.get('images') as FormArray).push(imageGroup);
    this.imageIndex = (this.form.get('images') as FormArray).length -1
    this.modalServices.open(this.addimageModal,{centered:true,backdrop:'static'})
  }

  onFileChange(event: any, index = this.imageIndex) {
    const MAX_FILE_SIZE_MB = 1.5;
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`);
        this.removeImage()
      }
      
      const imagesArray = this.form.get('images') as FormArray;
      imagesArray.at(index).patchValue({
        image: file
      });
  
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        imagesArray.at(index).patchValue({
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
    this.closePopup()
  }


  removeImage(index=this.imageIndex) {
    (this.form.get('images') as FormArray).removeAt(index);
    this.modalServices.dismissAll()
  }

  closePopup()
  {
    this.modalServices.dismissAll()
  }

  convertArrayToString(formArray: FormArray): string {
    let result = "";
    const data = formArray.value; // Assuming `formArray.value` gives an array of values
    for (let value of data) {
      if (result !== "") {
        result += ";" + value;
      } else {
        result = value;
      }
    }
    return result;
  }   

  convertStringToArray(arrayString:string):never[]{
    const result = arrayString.split(';')
    return result as never
  }


  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,").
          // We split the string and return only the base64 part.
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  getPostDetailsForUpdate() {
    if (this.postid) {
      this.postService.getPostById(this.postid).subscribe((data) => {
        console.log(data)
        this.form.patchValue({
          postName: data.postName,
          AdditionalName:data.AdditionalName,
          description: data.description,
          category: data.category,
          ratings: data.ratings,
          date: data.date,
        });
  
        // Update tags
        const CZtags = this.convertStringToArray(data.tags);
        const tagsArray = this.getTags(); // Access the FormArray directly
        CZtags.forEach((tag) => {
          tagsArray.push(new FormControl(tag)); // Push new FormControl
        });
  
        // Update subCategories
        const CZsubCategories = this.convertStringToArray(data.subcategory);
        this.form.patchValue({
          label:CZsubCategories[0],
          sublabel:CZsubCategories[1]
        })
        data.images.forEach(async (val: any)=>{
          const array = await "data:image/jpeg;base64," + this.sharedSerivices.convertBinaryToBase64(val?.data)
          console.log(array)
          const image = await this.sharedSerivices.convertBase64ToFile(array,'image/jpeg')
          const imageGroup = this.formBuilder.group({
            image: image,
            preview: array,
          });
          (this.form.get('images') as FormArray).push(imageGroup);
        })
      });
    }

  }

  renderLabels(name:string)
  {
    const labels = this.categories.filter((category)=>{return category.label === name})
    console.log(labels)
    this.labelList =  JSON.parse(labels[0].sublabel)
    this.onSelectCategory(name)
  }

  renderSubLabels(name:string)
  {
    this.subLabelList = (this.labelList.filter((label)=>{return label.name === name}))[0].subTags
    this.onSelectLabel(name)
  }

  selectSubLabel(name:string)
  {
    this.onSelectSubLabel(name)
  }
    
}
