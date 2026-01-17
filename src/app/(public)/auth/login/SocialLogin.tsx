import { signIn } from "next-auth/react";
import { Github, Instagram, Languages, Mail } from "lucide-react";

const SocialLogin = () => {
  return (
    <div className="text-center h-24 flex items-center justify-center gap-5">
      <div>
        <Languages
          onClick={() =>
            signIn("google", {
              callbackUrl: "http://localhost:3000/myProfile",
            })
          }
          className="border border-2 text-4xl rounded-full p-[5px] hover:text-[#1de2a3] hover:text-[38px] ease-in duration-200 cursor-pointer"
        />
      </div>
      <Github
        onClick={() => 
          signIn("github", {
            callbackUrl: "http://localhost:3000/myProfile",
          })
        }
        className="border border-2 text-4xl rounded-full p-[5px] hover:text-[#1de2a3] hover:text-[38px] ease-in duration-200 cursor-pointer"
      />
      <Mail
        onClick={() => 
          signIn("email", {
            callbackUrl: "http://localhost:3000/myProfile",
          })
        }
        className="border border-2 text-4xl rounded-full p-[5px] hover:text-[#1de2a3] hover:text-[38px] ease-in duration-200 cursor-pointer"
      />
      <Instagram
        onClick={() => 
          signIn("instagram", {
            callbackUrl: "http://localhost:3000/myProfile",
          })
        }
        className="border border-2 text-4xl rounded-full p-[5px] hover:text-[#1de2a3] hover:text-[38px] ease-in duration-200 cursor-pointer"
      />
    </div>
  );
};

export default SocialLogin;
