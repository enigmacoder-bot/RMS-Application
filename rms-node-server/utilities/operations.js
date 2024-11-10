 const randomizeString = (input) => {
    input = input.split('@')[0]
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < input.length; i++) {
        if (Math.random() < 0.5) {
            result += input[i];
        } else {
            result += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
    }
    result += Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    return result;
}


const randomizeUsername = (email) =>{
  let username = email.split('@')[0];
  let usernameArray = username.split('');
  for (let i = usernameArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [usernameArray[i], usernameArray[j]] = [usernameArray[j], usernameArray[i]];
  }
  return usernameArray.join('');
  }


const convertFileToBase64 = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      try {
        const base64 = fileBuffer.toString('base64');
        resolve(base64); // Resolve with the Base64 string
      } catch (err) {
        reject(err); // Handle any errors
      }
    });
  }


  const removeDoubleQuotes = async (obj) => {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj,key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          await removeDoubleQuotes(obj[key]);
        } else if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(/"/g, '');
        }
      }
    }
    return obj;
  }




module.exports = {convertFileToBase64,randomizeString,removeDoubleQuotes,randomizeUsername};
