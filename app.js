const typingForm=document.querySelector(".typing-input");
const main=document.querySelector(".chat-list");
const togglethemebutton=document.querySelector("#toggle-theme-button");
const deletebtn=document.querySelector("#delete-chat");
const suggestion=document.querySelectorAll(".suggestion .box");
const API_KEY="AIzaSyBCjEnWdcjqMQDN0i7UiRQiGoQyhJyWFYI";
// third step
const createMessageElement=(content,...classes)=>{
  let div=document.createElement("div");
  div.classList.add("message",...classes);
div.innerHTML=content;
return div;

}


const sequenceprint=(word,textarea)=>{
 
let value=word.trim(' ');
  for(let i=0;i<value.length;i++){
    setTimeout(()=>{
      textarea.innerHTML+=value[i];
      localStorage.setItem("savedchats",main.innerHTML);

      main.scrollTo(0,main.scrollHeight);
    },10*i);
  }
}
const generateResponse=async(animation)=>{
  let firm=animation.querySelector(".loading-indicator");
 
  const textarea=animation.querySelector("p");
  // if(textarea.style.display=="none"){
  //   textarea.style.display=="block";
  // }
  
  // console.log(textarea)
  // textarea.innerHTML=apiResonse;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
  
try{

  const response=await fetch(API_URL,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
      parts:[{text:userMessage}]
        },
      ],
    }),
  });
  const data=await response.json();
  console.log(data);
  //get the api resopnse text and remove astriked from it
  const apiResonse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1');
  


  console.log(apiResonse);
 

  sequenceprint(apiResonse,textarea);
  
  firm.style.display="none";
  

  
  console.log(textarea)
}catch(err){
  console.log(err);
}

}
const loadingAnimation=()=>{

    const html=`
     <div class="message-content">
            <img src="star.png" alt="star-image" class="avatar">
            <p class="text"></p>
            <div class="loading-indicator">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            </div>
            </div>
            <span onclick="copyMessage(this)" class="set material-symbols-outlined">content_copy</span>
    </div>`
    let animation=createMessageElement(html,"incoming","loading");
console.log(animation);
main.append(animation);

main.scrollTo(0,main.scrollHeight);
generateResponse(animation);
}

//second step
let userMessage=null;
const handleOutgoingChat=()=>{
  userMessage=  typingForm.querySelector(".input").value.trim()||userMessage;

if(!userMessage) return;//exit if there is no message
console.log(userMessage);
// message=userMessage;
const html=`
 <div class="message-content">
                <img src="men.jpeg" alt="user-image" class="avatar">
                <p class="text"></p>
            </div>   
`
 let outgoing=createMessageElement(html,"outgoing");
 outgoing.querySelector(".text").innerText=userMessage;
main.append(outgoing);
// handleIncomingChat();

document.body.classList.add("hide-header");//hide the header once chat starts
setTimeout(loadingAnimation,500);
typingForm.querySelector(".input").value="";
}

//copy method
const copyMessage=(copy)=>{
   
  navigator.clipboard.writeText(copy.parentElement.querySelector(".text").innerText);
  copy.innerText="done";
 
}

//toggle theme button

togglethemebutton.addEventListener("click",()=>{
  const islightMode=document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor",islightMode?"light_mode":"dark_mode");
  togglethemebutton.innerText=islightMode?"dark_mode": "light_mode";
})

//when page will refresh then its show same like that

const loadlocalstorage=()=>{
  const saveTheme=localStorage.getItem("themeColor");
  if(saveTheme==="light_mode"){
    document.body.classList.add("light_mode");
  }else{
    document.body.classList.add("dark_mode");
  }
  const savechat=localStorage.getItem("savedchats");
  main.innerHTML=savechat||" ";
  document.body.classList.toggle("hide-header", savechat);
// main.scrollTo(0,main.scrollHeight);
}

loadlocalstorage();


// delete chat from local storage

deletebtn.addEventListener("click",()=>{
  if(confirm("Are you sure you want to delte all messages?")){
    localStorage.removeItem("savedchats");
    // main.innerHTML="";
    loadlocalstorage();
  }
})
//first step
typingForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    
    handleOutgoingChat();
})

main.scrollTo(0,main.scrollHeight);

// for(advice of suggestion){
  
//   console.log(advice);
//   let value=advice.querySelector(".text");
//   console.log(value.innerText);
//   advice.addEventListener("click",()=>{
//     let value=advice.querySelector(".text");
//     console.log(value.innerText);
//   })
// }

suggestion.forEach(suggestion=>{
  suggestion.addEventListener("click",()=>{
    userMessage=suggestion.querySelector(".text").textContent;
handleOutgoingChat(userMessage);
})
})





