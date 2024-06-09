import { useEffect, useState } from "react";
import images from "../../images";

function Carousel() {
    const carousel = [
        images.slide1,
        images.slide2,
        images.slide3
    ];

    const [index, setIndex] = useState(0);
    useEffect(()=>{
        if (index < carousel.length - 1){
            const intervalId = setInterval(() =>{
                setIndex(prevIndex => (prevIndex + 1)%carousel.length);
            }, 2000);
            return () => clearInterval(intervalId);
        }
    },[carousel.length]);

    return (
        <div className='w-auto'>
            <div className='rounded-2xl bg-center bg-cover duration-500'>
                <img alt = "img_intro_web"src={carousel[index]}/>
            </div>
        </div>
    );
}

export default Carousel;
