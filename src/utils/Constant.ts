import { toast } from "react-toastify";
export function getISTDate() {
  const someDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istDate = new Date(someDate.getTime() + istOffset);

  const defaultValues = istDate.toISOString().split("T")[0];
  const defaultValuestime = istDate.toISOString();

  return {
      defaultValues,
      defaultValuestime,
  };
}


export function getId() {
  let ID:any = localStorage.getItem("useR_ID");
  try {
    return JSON.parse(ID);
  } catch (error) {
    console.error("Error parsing ID from localStorage:", error);
    return null;
  }
}
export const getUserType = () => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (user?.verifiedUser?.userTypeID == '1')
        return 'Admin'
    else
        if (user?.verifiedUser?.userTypeID == '11')
            return 'Candidate'
        else
            if (user?.verifiedUser?.userTypeID == '21')
                return 'InstituteUser'
             
}

export function getdivisionId(){
  let divId = localStorage.getItem("id");
  return divId;
}

export function getinstId(){
  let instId = localStorage.getItem("inst_id");
  return instId;
}


