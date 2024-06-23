function Button({nav, text, color, colorHover, colorActive}) {
    if(nav){
        return (
            <button className={`bg-${color} hover:bg-${colorHover} focus:bg-${colorActive} mr-6 ml-6 p-3 pr-24 pl-24 rounded text-white font-semibold text-xl`}>{text}</button>
        );
    }else{
        return (
            <button className="bg-green-500 hover:bg-green-700 p-2 rounded text-white m-1">{text}</button>
        );
    }
}

export default Button;
