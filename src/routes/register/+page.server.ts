import { fail, redirect } from "@sveltejs/kit";

interface RegisterReturnObject {
  success: boolean;
  email:string;
  password:string;
  passwordConfirmation:string;
  name:string;
  errors: string[];
}

interface UserObj {

}

export const actions = {
  default: async ({ request, locals:{supabase} }) => {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;

    const returnObject: RegisterReturnObject = {
      success: true,
      name,
      email,
      password,
      passwordConfirmation,
      errors: [],
    };

    if (name.length < 3) {
      returnObject.errors.push(
        "The name is too short, must be lengt 3 characters"
      );
    }
    if (!email.length) {
      returnObject.errors.push("email required.");
    }
    if (!password.length) {
      returnObject.errors.push("password required");
    }

    if (password !== passwordConfirmation) {
      returnObject.errors.push(
        "the password and confirmation password do not match"
      );
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }
   
    const {data,error} =await supabase.auth.signUp({
        email,
        password,
     });
     if(error || !data.user){
        console.log("there as an errr");
        console.log(error);
        returnObject.success=false;
        return fail(400, returnObject as any)
     }
     
     await supabase.from('user_names').insert([
      {
        user_id: data.user.id,
        name,
     }
    ]);


     redirect(303,"/private/dashboard");
  },
};
