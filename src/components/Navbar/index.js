import { NavLink } from "react-router-dom";
import Button from "../Button";
import { useTranslation } from 'react-i18next';

function Navbar({user}) {
    const {t} = useTranslation();

    return (
        <div class="flex flex-wrap justify-between bg-primary h-[76px] items-center ">
            <NavLink to={"/try"}>
                <Button color={"green-500"} colorHover={"green-700"} nav={true} text={t('navbar.try')} />
            </NavLink>
            <NavLink to={"/study"} state={user}>
                <Button color={"green-500"} colorHover={"green-700"} nav={true} text={t('navbar.study')} />
            </NavLink>
            <NavLink to={"/result"} state={user}>
                <Button color={"green-500"} colorHover={"green-700"} nav={true} text={t('navbar.result')} />
            </NavLink>
            <NavLink to={"/support"} state={user}>
                <Button color={"green-500"} colorHover={"green-700"} nav={true} text={t('navbar.support')} />
            </NavLink>
        </div>
    );
}

export default Navbar;