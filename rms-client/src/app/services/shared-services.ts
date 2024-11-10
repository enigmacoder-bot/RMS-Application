import { Injectable } from "@angular/core";
import { FormArray } from "@angular/forms";
import { Location } from "@angular/common";

@Injectable({
    providedIn:"root"
})

export class SharedServices{

  constructor(private location:Location){}

    randomizeUsername(email:string){
    let username = email.split('@')[0];
    let usernameArray = username.split('');
    for (let i = usernameArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [usernameArray[i], usernameArray[j]] = [usernameArray[j], usernameArray[i]];
    }
    return usernameArray.join('');
    }

    navigateToPreviousPage(){
      this.location.back()
    }

      convertBinaryToBase64(binaryData: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(binaryData);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary); 
      }

      convertBase64ToFile(base64String: string, mimeType: string): File {
        const byteString = atob(base64String.split(',')[1]); 
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
      
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
      
        const fileName = `${crypto.randomUUID()}.${mimeType.split('/')[1]}`; 
      
        return new File([uint8Array], fileName, { type: mimeType });
      }
      

      trimString(str:string,start:number,end:number):string{
        if (start < 0 || end > str.length || start >= end) {
          return str; 
        }
        return str.substring(0, start) + str.substring(end);
      }

      convertArrayToString(formArray: FormArray): string {
        let result = "";
        const data = formArray.value; 
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


}