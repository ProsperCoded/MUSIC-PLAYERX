export function log(display: boolean, ...messages: any[]) {
  // console.log(JSON.stringify(msg));
  if (display) {
    let full_message = "";
    messages.forEach((msg) => {
      if (typeof msg === "object") {
        full_message = full_message.concat("\n", JSON.stringify(msg), " \n");
      } else {
        full_message = full_message.concat(msg.toString(), " ");
      }
      alert(full_message);
      console.log(full_message);
    });
  } else {
    console.log(...messages);
  }
}

const date = new Date();
date.setSeconds(130);
console.log("minutes in 130s", date.getMinutes());

export function convertSecToString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  let m = minutes.toString();
  let s = sec.toString();
  s = s.length > 1 ? s : "0" + s;
  return `${m}:${s}`;
}
