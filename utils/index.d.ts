import { GuildMember } from "discord.js";

declare module "utils";

function convertToLowerCase(string: String): String;
function convertToUpperCase(string: String): String;
function reverseString(string: String): String;
function returnUserStatusText(user: GuildMember): String;
function emojifyText(text: String): String;
function sortCommands(): Object;
