export function validateEmail(email){
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	return re.test(String(email).toLocaleLowerCase());
}
export function validatePassword(password,confirmPassword){
	let valLengthPass=6;
	if(password === confirmPassword){
		
		return password.length >= valLengthPass ? true : false;
	}
	return false;

}