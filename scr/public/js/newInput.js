var i = 0;
const newInput = () => {
   const component = document.createElement("template");
   component.innerHTML =
      `<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text mr-1 font-weight-bold" id="basic-addon1">&vrtri;</span></div><input type="text" class="form-control border-primary" placeholder="Nueva estación o género" name="category${i}"><div class="input-group-prepend "><a onclick="delInput(this)" class="input-group-text bg-danger text-decoration-none btn rounded ml-2" id="basic-addon1">&Xopf;</a></div></div>`.trim();
   nodeComponent = component.content.firstChild;
   document.querySelector("#inputContainer").appendChild(nodeComponent)
   i++;
}

const delInput = (e) => e.parentNode.parentNode.remove();

