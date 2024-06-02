function InputForm({text, type, onChange}) {

    return (
        <div className="mt-2">
            <div className="flex rounded-md shadow-sm sm:max-w-md ring-inset ring-2 ring-navbar mb-2">
                <input
                    type={type}
                    name={text}
                    id={text}
                    autoComplete="username"
                    onChange={onChange}
                    className="block flex-1 border-2 font-bold rounded-md bg-input py-2 pl-4 min-w-96 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={text}
                />
            </div>
        </div>
    );
}

export default InputForm;