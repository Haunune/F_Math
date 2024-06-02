function Button({nav, text}) {
    if(nav){
        return (
            <button class="bg-green-500 hover:bg-green-700 mr-6 ml-6 p-3 pr-28 pl-28 rounded text-white font-semibold text-xl">{text}</button>
        );
    }else{
        return (
            <button class="bg-green-500 hover:bg-green-700 p-2 rounded text-white m-1">{text}</button>
        );
    }
}

export default Button;
