const createForm = document.querySelector("#create-cmt");
createForm.addEventListener("submit", e=>{
    e.preventDefault();
    const cmtObj = {
        comment:document.querySelector("#new-comment").value,
        postid:createForm.dataset.postid,
    }
    console.log(cmtObj)
    fetch("/api/comments", {
        method:"POST",
        body:JSON.stringify(cmtObj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(res=>{
        if(res.ok) {
            location.reload()
        } else {
            alert('comment creat fail')
        }
    })
})

const delCmtButtons = document.querySelectorAll(".cmt-del-btn");
delCmtButtons.forEach(delBtn=>{
    delBtn.addEventListener("click",e=>{
        const cmtId = e.target.getAttribute("data-cmtid")

        fetch(`/api/comments/${cmtId}`,{
            method:"DELETE"
        }).then(res=>{
            if(res.ok){
                location.reload();
            } else {
                alert("Error deleting a comment")
            }
        })
    })
})