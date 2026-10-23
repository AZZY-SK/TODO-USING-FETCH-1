
const cl=console.log;

const form=document.getElementById('todoForm');
const spinner=document.getElementById('spinner');
const todoContainer=document.getElementById('todoContainer');
const todoInput=document.getElementById('todoInput');
const updateTodoBtn=document.getElementById('updateTodoBtn');
const addTodoBtn=document.getElementById('addTodoBtn');

const BASE_URL="https://crud-93d88-default-rtdb.asia-southeast1.firebasedatabase.app/";

function snackBar(msg, icon) {
    Swal.fire({
        text: msg,
        icon: icon,
        timer: 3000
    })
}

function handleSpinner(flag) {
    if (flag) {
        spinner.classList.remove("d-none");
    } else {
        spinner.classList.add("d-none");
    }
}

 const localstate={
     todoArr:[],
     editId:null
 }

  function snackbar(msg,icon){
         swal.fire({
        text: msg,
        icon: icon,
        timer: 3000
    })
  }

  // read

function fetchtodo(){
          handleSpinner(true);
  const GET_URL=`${BASE_URL}todo.json`
  
   fetch(GET_URL,{
    method:"GET",
     body:null,
     headers:{
      "content-type":"application/json",
      "authrization":"jwt token"
     },
     
   })
     .then(res=>{
          if(!res.ok){
            throw new Error("error");
          }
          return res.json();
             })
     .then(data=>{
         for(let key in data){
             data[key].id=key
             localstate.todoArr.unshift(data[key]);
         }
               rendering(localstate.todoArr);

        //  cl(data)
     })
     .catch(Error=>{
           snackBar(`error while fetching data`, "error");
     })
     .finally(()=>{
         cl("1-api res")
          handleSpinner()
     })
}
fetchtodo()

function rendering(arr){
       let res=``;
      //  cl(arr)
       arr.forEach(todo => {
           res+=`<li class="list-group-item d-flex justify-content-between" id="${todo.id}">
                                <strong>${todo.todoItem}</strong>
                                <div>
                                    <button onclick="fetchedit(this)"  class="btn btn-sm btn-outline-dark">Edit</button>
                                    <button onclick="fetchdelete(this)" class="btn btn-sm btn-outline-danger ml-2">Remove</button>
                                </div>
                            </li> `
       });
       todoContainer.innerHTML=res;
}

// create 

 function fetchcreate(eve){
      eve.preventDefault();
      
     const post_url=`${BASE_URL}todo.json`
     let newobj={
         todoItem:todoInput.value,
     }      
       handleSpinner(true);
     fetch(post_url,{
       body:JSON.stringify(newobj),
     headers:{
      "content-type":"application/json",
      "authrization":"jwt token"
     },
     method:"POST"
     })
          .then(res=>{
            if(!res.ok){
              throw new Error()
            }
            return res.json();
          })
          .then(data=>{
            newobj.id=data.name
            // cl(newobj)
            localstate.todoArr.unshift(newobj);
             form.reset();

           // create newli on ui
            
           let li=document.createElement('li');
           li.id=newobj.id;
          //  cl(li.id)
          li.className="list-group-item d-flex justify-content-between"; 
           li.innerHTML=`<strong>${newobj.todoItem}</strong>
                                <div>
                                    <button onclick="fetchedit(this)" class="btn btn-sm btn-outline-dark ">Edit</button>
                                    <button onclick="fetchdelete(this)" class="btn btn-sm btn-outline-danger ml-2">Remove</button>
                                </div>`
                        
           
            todoContainer.prepend(li);
                 snackbar(`Todo added successfully`, "success");
          })
          .catch(err=>{
              cl(err);
          })
          .finally(()=>{
               cl("ya babe its create functionaliy's res");
                handleSpinner()
          })    
            
 }

 // edit

 function fetchedit(ele){
          let editid=ele.closest("li").id;     
    //  cl(editid)
          localstate.editId=editid;
    let getobj=localstate.todoArr.find(t=>t.id===editid);
      todoInput.value=getobj.todoItem;
     addTodoBtn.classList.add('d-none');
     updateTodoBtn.classList.remove('d-none');
          

          // cl(editid)     
          // let edit_url=`${BASE_URL}user${editid}.json`;
          // fetch(edit_url,{
          //   method:'GET',
          //   headers:{
          //         "content-type":"application/json",
          //         "authrization":"jwt token"
          //  },
          //     body:null
          // })

          // .then(res=>{
          //   if(!res.ok){
          //      throw new Error('something went wrong');
          //   }
          //    return res.json();
          // })
          //  .then(data=>{
          //      cl(data)
          //  })
 }

 // update

  function fetchupdate(){
      let updateid= localstate.editId;
      //     const udpateId = localstate.editId;

      // cl(updateid);
      let update_url=`${BASE_URL}todo/${updateid}.json`;
      let updatedobj={
           todoItem:todoInput.value
      }
       handleSpinner(true);
      fetch(update_url,{
        method:'PATCH',
          headers:{
                  "content-type":"application/json",
                  "authrization":"jwt token"
           },
           body:JSON.stringify(updatedobj)
            })

            .then(res=>{
                if(!res.ok){
                   throw new Error();
                }
                return res.json();
            })
            .then(data=>{
                     updatedobj.id = updateid; 
                 let getindex=localstate.todoArr.findIndex(t=>t.id===updateid);
                 localstate.todoArr[getindex]=updatedobj;
          
                    
                 // show on ui updated obj
                 let updatedli=document.getElementById(updateid).querySelector("strong").innerHTML=updatedobj.todoItem;
                 form.reset();
                 localstate.todoArr
                 updateTodoBtn.classList.add('d-none');
                 addTodoBtn.classList.remove('d-none')
                 cl(updatedli);
               
                 snackbar(`Todo updated successfully`, "success");
            })
            .catch(err=>{
                cl(err)
            })
            .finally(()=>{
                cl("updated res")
                 handleSpinner()
            })
    

  }

// delete

  function fetchdelete(ele){
     let deleteid=ele.closest("li").id
     let DELETE_URL=`${BASE_URL}todo/${deleteid}.json`
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#070707",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"})

        .then((result)=>{
           handleSpinner(true)
             if(result.isConfirmed){
                fetch(DELETE_URL,{
                  method:'DELETE',
                headers:{
                  "content-type":"application/json",
                  "authrization":"jwt token"
           },
           body:null
                })
             
             .then(res=>{
                if(!res.ok){
                  throw Error()
                }
                return res.json()
             })
            
             .then(data=>{
         
         let gettodoindex= localstate.todoArr.findIndex(t=>t.id===deleteid)
         localstate.todoArr.splice(gettodoindex,1)
        ele.closest('li').remove();

     })

     .catch(err=>{
        cl(err)
     })
     .finally(()=>{
          cl("completed")
          handleSpinner()
     })
             }else{
                handleSpinner()
             }
        })
        
           
      
      }
   
updateTodoBtn.addEventListener('click',fetchupdate);
form.addEventListener("submit",fetchcreate)

