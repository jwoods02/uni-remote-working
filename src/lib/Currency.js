export default function convertToPounds(pence) {
  const pounds = pence / 100;
  return pounds.toLocaleString("en-US", { style: "currency", currency: "GBP" });
}
