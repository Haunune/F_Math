function Button({nav, text, color, colorHover, colorActive}) {
    if(nav){
        return (
            <button className={`bg-${color} hover:bg-${colorHover} focus:bg-${colorActive} 2xl:px-24 xl:px-14 lg:px-11 sm:px-3 sm:mx-6 min-[360px]: -mx-1 sm:p-3 p-2 mx-1 rounded text-white font-semibold text-xs sm:text-xl`}>{text}</button>
        );
    }else{
        return (
            <button className="bg-green-500 hover:bg-green-700 p-2 rounded text-white m-1">{text}</button>
        );
    }
}

export default Button;
