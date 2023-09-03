import NodeRSA from "node-rsa";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const publicKey = process.env.RSA_PUBLIC_KEY!.split(String.raw`\n`).join("\n");
const privateKey = process.env
  .RSA_PRIVATE_KEY!.split(String.raw`\n`)
  .join("\n");

export function encrypt(text: number): string {
  const encrypted = encryptNumber(publicKey, text);

  return encrypted;
}

export function decrypt(encrypted: string): number {
  const decrypted = decryptNumber(privateKey, encrypted);

  return decrypted;
}

function encryptNumber(publicKey: string, number: number): string {
  // const encmsg = crypto.privateEncrypt(publicKey, Buffer.from(number, 'utf8') ).toString('base64');
  const key = new NodeRSA(Buffer.from(publicKey), "pkcs8-public-pem");
  const encrypted = key.encrypt(Buffer.from(number.toString()), "base64");
  return encrypted;
}

// 비밀키를 이용하여 암호화된 숫자를 복호화하는 함수
function decryptNumber(privateKey: string, encrypted: string): number {
  const key = new NodeRSA(privateKey, "pkcs8-private-pem");
  const decrypted = key.decrypt(encrypted, "buffer"); // 'buffer'로 반환형식을 설정합니다.
  const decryptedNumber = parseInt(decrypted.toString(), 10);
  return decryptedNumber;
}
