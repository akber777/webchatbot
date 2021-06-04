// async function newUser(tenantID) {
//   const res = axios.post(
//     `http://ec2-3-120-103-49.eu-central-1.compute.amazonaws.com:8080/api/public/web/bot/${tenantID}`
//   );
//   return res;
// }

// if (
//   localStorage.getItem("tenantID") != null &&
//   localStorage.getItem("tenantID") != ""
// ) {
//   newUser(localStorage.getItem("tenantID"))
//     .then((user) => user.json())
//     .then((result) => {
//       console.log(resul);
//     });
// }
