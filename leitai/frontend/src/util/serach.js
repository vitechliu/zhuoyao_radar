export default petid => {
  const petlist = localStorage.getItem("pet");
  if (petlist) {
    const list = JSON.parse(petlist);
    return list.find(pet => pet.Id === petid);
  }
};
