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

export function DateTimeConverter(ISOdate, line) {
  const dateFormat = new Date(ISOdate).toLocaleDateString();
  const timeFormat = new Date(ISOdate).toLocaleTimeString();
  if (line === 2) {
    return (
      <>
        <p style={{ padding: 0, margin: 0 }}>{dateFormat}</p>
        <p style={{ padding: 0, margin: 0 }}>{timeFormat}</p>
      </>
    );
  } else {
    return dateFormat + " " + timeFormat;
  }
}

export function DateConverter(ISOdate) {
  const dateFormat = new Date(ISOdate).toLocaleDateString();
  return dateFormat;
}

export function TimeConverter(ISOdate) {
  const timeFormat = new Date(ISOdate).toLocaleTimeString();
  return timeFormat;
}

export function getLoginImage() {
  const x = Math.floor(Math.random() * 10 + 1);
  const image = require(`../images/login/${x}.jpg`);
  return image.default;
}

export function getLoginImageMobile() {
  const x = Math.floor(Math.random() * 10 + 1);
  const image = require(`../images/login/mobile/${x}.jpg`);
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

export function getLogoutImageMobile() {
  const x = Math.floor(Math.random() * 11 + 1);
  const image = require(`../images/logout/mobile/${x}.jpg`);
  return image.default;
}

export function removeSpace(value) {
  return value.replace(/\s/g, "");
}

export function Capitalize(str) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export function CapitalizeFirstLetters(str) {
  const arr = str?.split(" ");
  for (var i = 0; i < arr?.length; i++) {
    arr[i] = arr[i]?.charAt(0)?.toUpperCase() + arr[i]?.slice(1);
  }
  return arr.join(" ");
}

export const getHourMin = (date) => {
  return new Date(date).toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
