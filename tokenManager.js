const Base64 = require('crypto-js/enc-base64');
const Utf8 = require('crypto-js/enc-utf8');


class tokenManager{
    constructor(secret, cryptFuncName='hmac-sha512') {
        this.secret = secret;
        this.cryptFunc  =  require('crypto-js/' + cryptFuncName);
    }


    decodeSafeBase64(base64_safe_string) {
        base64_string = base64_safe_string + '=';
        base64_string = base64_string.replace('-', /\+/g);
        base64_string = base64_string.replace('_', /\//g);
        utf_string = Base64.parse(base64_string);
    
        return utf_string;
    }


    encodeSafeBase64(utf_string) {
        var base64_string = Base64.stringify(utf_string);
        var base64_safe_string = base64_string.replace(/=+$/, '');
        base64_safe_string = base64_safe_string.replace(/\+/g, '-');
        base64_safe_string = base64_safe_string.replace(/\//g, '_');
        
        return base64_safe_string;
    }
        

    encodeJson(jsonObject){
        var stringifiedData = Utf8.parse(JSON.stringify(jsonObject));
        var encodedData = this.encodeSafeBase64(stringifiedData);
    
        return encodedData;
    }


    decodeJson(base64_safe_string){
        var utf_string = this.decodeSafeBase64(base64_safe_string);
        var jsonObject = JSON.parse(Utf8.stringify(utf_string));
    
        return jsonObject;
    }


    createToken(header, data){
        var token = this.encodeJson(header) + "." + this.encodeJson(data);
    
        return token;  
    }  
    

    createSignedToken(header, data){
        var token = this.createToken(header, data);
        var signature = this.cryptFunc(token, this.secret);
        signature = this.encodeSafeBase64(signature);
        var signedToken = token + "." + signature;
    
        return signedToken;
    }


    checkToken(signedToken) {
        signedToken = String(signedToken);
        var signatureIndex = signedToken.lastIndexOf('.');
        var token = signedToken.substr(0, signatureIndex);
        var signature = signedToken.substr(signatureIndex + 1);
        if (this.encodeSafeBase64(this.cryptFunc(token, this.secret)) == signature){
        
            return true;    
        }
        else{

            return false;
        }    
    }

}

module.exports = tokenManager;
/*
lvgUQa6YlAsybgS8fg8J
yMP4ZI9TUuqfHtrS9L5z
0rM8i751XfInFJW6j9bI
0jElr3STh1M4oJlCmPry
3YG2GAUm0BQaAZsTqNds
IPglB66I73mLpIeQojNT
MDXbfMsaYjpCEcKkab02
EH1oZ3maxmjGocPZodB4
Ki6CKynsH9tMNlLCSGO2
i9rBd0gy7ohi3ORXYedn
KssN6P7f8pG5gxDZk8ek
7r2ili4AApSJcjLaAWUo
9LWBcaCXB6jdYxw6WHh8
K0rEWQaSyT2SnXdp0TqT
HOnDzfk8EEJBkqgZwsy8
*/

