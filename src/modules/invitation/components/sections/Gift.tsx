import { useTheme } from "@/modules/invitation/theme/ThemeProvider";

export default function LuxuryBlackGift({
  data,
}: {
  data: any;
}) {

  const theme = useTheme();

  const copyAccount = () => {

  navigator.clipboard.writeText(
    data.accountNumber
  );

  alert(
    "Nomor rekening berhasil disalin"
  );

};
  return (
  <section id="gift" className="py-10">

    <div className="max-w-3xl mx-auto px-6 text-center">

      <div className="relative w-40 h-40 mx-auto mb-6">

        <img
          src={theme.gift.frame}
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <span
  className={`
  text-4xl
  ${theme.gift.iconColor}
  `}
>
  {theme.gift.icon}
</span>
        </div>

      </div>

      <h2
className={`
text-4xl
${theme.font.title}
${theme.text.primary}
`}
>
  {theme.gift.title}
</h2>

      <img
        src={theme.gift.divider}
        alt=""
        className="w-56 mx-auto my-6"
      />

      <div
        className={`
max-w-lg
mx-auto
${theme.gift.card}
`}
      >

        <p className={theme.gift.bankLabel}>
          Transfer Bank
        </p>

        <h3
className={`
text-2xl
mt-2
${theme.gift.bankName}
`}
>
          {data.bankName}
        </h3>

        <p
className={`
text-2xl
font-semibold
mt-4
${theme.gift.accountNumber}
`}
>
          {data.accountNumber}
        </p>

        <p
className={`
mt-2
${theme.gift.accountName}
`}
>
          a.n. {data.accountName}
        </p>

        <button
          onClick={copyAccount}
          className={theme.gift.button}
        >
          Salin Nomor Rekening
        </button>

      </div>

      {data.qrisImage && (

          <div
  className={`
max-w-md
mx-auto
${theme.gift.qrisCard}
`}
>

          <h3 className={`${theme.text.primary} text-2xl mb-5`}>
  QRIS
</h3>

          <div
            className={theme.gift.qrisFrame}
          >

            <img
  src={data.qrisImage}
  alt="QRIS"
  className="
  w-full
  max-w-[280px]
  mx-auto
  rounded-2xl
  "
/>

          </div>

        </div>

      )}

    </div>

  </section>
);
}