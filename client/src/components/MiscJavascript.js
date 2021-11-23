import { SiMaterialui } from "react-icons/si";
import {
  RiHtml5Fill,
  RiCss3Fill,
  RiReactjsLine,
  RiComputerFill,
} from "react-icons/ri";
import { IoLogoJavascript, IoLogoNodejs } from "react-icons/io";
import { AiFillApi } from "react-icons/ai";
import { FaServer, FaMobile } from "react-icons/fa";
import { MdOutlineWeb, MdOutlineDisabledByDefault } from "react-icons/md";

export function getIcon(value) {
  switch (value) {
    case "API":
      return <AiFillApi />;
    case "Backend":
      return <FaServer />;
    case "CSS":
      return <RiCss3Fill />;
    case "Frontend":
      return <RiComputerFill />;
    case "General":
      return <SiMaterialui />;
    case "HTML":
      return <RiHtml5Fill />;
    case "Javascript":
      return <IoLogoJavascript />;
    case "Mobile":
      return <FaMobile />;
    case "NodeJS":
      return <IoLogoNodejs />;
    case "React":
      return <RiReactjsLine />;
    case "Web":
      return <MdOutlineWeb />;
    default:
      return <MdOutlineDisabledByDefault />;
  }
}

export function DateTimeConverter(ISOdate) {
  const dateFormat = new Date(ISOdate).toLocaleDateString();
  const timeFormat = new Date(ISOdate).toLocaleTimeString();
  return dateFormat + " " + timeFormat;
}

export function DateConverter(ISOdate) {
  const dateFormat = new Date(ISOdate).toLocaleDateString();
  return dateFormat;
}

export function getLoginImage() {
  const x = Math.floor(Math.random() * 10 + 1);
  const image = require(`../images/login/${x}.jpg`);
  return image.default;
}

export function getHelloImage() {
  const x = Math.floor(Math.random() * 4 + 1);
  const image = require(`../images/hello/${x}.jpg`);
  return image.default;
}

export function getLogoutImage() {
  const x = Math.floor(Math.random() * 17 + 1);
  const image = require(`../images/logout/${x}.jpg`);
  return image.default;
}

export function removeSpace(value) {
  return value.replace(/\s/g, "");
}