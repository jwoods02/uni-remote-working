
export const generateAccessCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
  }


export const createGuest = (accessCode, location, email) => {
  //tbc
}
