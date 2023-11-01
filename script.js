window.addEventListener("load", function(){
    setTimeout(
        function open(event){
            document.querySelector(".popup").style.display = "block";
        },
        1000
    )
});
document.querySelector("#close").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "none";
});
 
document.getElementById("open-popup-btn").addEventListener("click", function(){
document.getElementsByClassName("popup")
[0].classList.add("active");
});
document.getElementById("dismiss-popup-btn").addEventListener("click", function(){
document.getElementsByClassName("popup")
[0].classList.remove("active");
});