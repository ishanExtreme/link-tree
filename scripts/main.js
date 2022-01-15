let canvas = document.getElementById("kumfu");
let ctx = canvas.getContext("2d");
canvas.style.left = "0px"
// loads image via callback function
let loadImage = (src, callback)=>{

    let img = document.createElement("img");
    img.onload = () => callback(img);

    /*
    / before images sepcifies to load from root directory
    */
    img.src = src;  
}

// returns image path
let getImagePath = (frameNumber, type)=>{

    return "/images/"+type+"/"+frameNumber+".png";
}
// load all the images required for an animation and calls the callback function once
// loading of "all" images are finished
let loadImages = (callback)=>{

    let imagesNumber = {"idle":8, "kick":7, "punch":7, "block":9, "forward":6, "backward":6};
    let images = {"idle":[], "punch":[], "kick":[], "block":[], "forward":[], "backward":[]};
    let count = 0;

    Object.keys(images).forEach((type)=>{

        let frameArray = [];
        for(let i=1; i<=imagesNumber[type]; i++)
            frameArray.push(i);
        frameArray.forEach((frameNumber)=>{

            loadImage(getImagePath(frameNumber, type), (img)=>{
                images[type].push(img);
                count++;
                if(count == 22)
                {
                    callback(images)
                }
            })
        })
    })

}

let animate = (images, type, callback)=>{

    images[type].forEach((image, index)=>{
        setTimeout(()=>{
            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(image, 0, 0, 500 , 500)
        }, index*100)
    });

    setTimeout(callback, images[type].length*100);
}

let forward = (original)=>{
    let step = 60;
    let nextVal = parseInt(original.substring(0, original.indexOf("p")));
    if(nextVal+step <= screen.width-350)
        nextVal+=step;
    return nextVal+"px";
}

let backward = (original)=>{
    let step = 60;
    let nextVal = parseInt(original.substring(0, original.indexOf("p")));
    if(nextVal-step >= 0)
        nextVal-=step;
    return nextVal+"px";
}

loadImages((images)=>{
    let queuedAnimation = [];
    let aux = ()=>{
        let selectedAnimation;
        if(queuedAnimation.length === 0)
            selectedAnimation = "idle";
        else
        {
            selectedAnimation = queuedAnimation.shift(); //pops the first element
            if(selectedAnimation == "forward")
                setTimeout(()=>{
                    canvas.style.left = forward(canvas.style.left)
                },images["forward"].length*100-100)
            if(selectedAnimation == "backward")
                setTimeout(()=>{
                    canvas.style.left = backward(canvas.style.left)
                },images["backward"].length*100-200)
        }

        animate(images, selectedAnimation, aux);
    }

    aux();
    
    let forwardId = null;
    let backwardId = null;
    document.addEventListener("keydown", (event)=>{
        
        const key = event.key;
        if((key === "d" || key === "D") && !forwardId)
        {
            forwardId = setInterval(()=>{
                queuedAnimation.push("forward");
            }, images["forward"].length*100)
        }
        else if((key === "a" || key === "A") && !backwardId)
        {
            backwardId = setInterval(()=>{
                queuedAnimation.push("backward");
            }, images["backward"].length*100)
        }
    })

    document.addEventListener("keyup", (event)=>{
        const key = event.key;

        if(key === "e" || key === "E")
            queuedAnimation.push("kick");
        else if(key === "q" || key === "Q")
            queuedAnimation.push("punch");
        else if(key === " ")
            queuedAnimation.push("block");
        else if(key === "d" || key === "D")
        {
            if(forwardId)
            {
                clearInterval(forwardId)
                queuedAnimation = []
                forwardId = null
            }
            queuedAnimation.push("forward");
                 
        }

        else if(key === "a" || key === "A")
        {
            if(backwardId)
            {
                clearInterval(backwardId)
                queuedAnimation = []
                backwardId = null
            }
            queuedAnimation.push("backward");
                 
        }
        
    })


});

