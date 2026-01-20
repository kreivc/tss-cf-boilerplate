import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface TransactionSuccessEmailProps {
  customerName?: string;
  transactionId?: string;
  gameName?: string;
  itemName?: string;
  amount?: number;
  date?: string;
}

export const TransactionSuccessEmail = ({
  customerName = "Customer",
  transactionId = "TXN-123456",
  gameName = "Mobile Legends",
  itemName = "86 Diamonds",
  amount = 15_000,
  date = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
}: TransactionSuccessEmailProps) => {
  const previewText = `Your top-up for ${gameName} was successful!`;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#f5f5f5] font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded-lg border border-[#e0e0e0] border-solid bg-white p-[32px] shadow-sm">
            {/* Header */}
            <Section className="text-center">
              <Text className="m-0 font-bold text-[24px] text-emerald-500">
                ✓
              </Text>
              <Heading className="mx-0 mt-[8px] mb-[24px] p-0 text-center font-semibold text-[22px] text-gray-900">
                Top-up Successful!
              </Heading>
            </Section>

            {/* Greeting */}
            <Text className="m-0 mb-[16px] text-[14px] text-gray-700 leading-[24px]">
              Hi {customerName},
            </Text>
            <Text className="m-0 mb-[24px] text-[14px] text-gray-700 leading-[24px]">
              Your top-up has been completed successfully. Here are your
              transaction details:
            </Text>

            {/* Transaction Details */}
            <Section className="rounded-lg bg-gray-50 p-[20px]">
              <table
                cellPadding={0}
                cellSpacing={0}
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      Transaction ID
                    </td>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#111827",
                        fontWeight: 500,
                        textAlign: "right",
                      }}
                    >
                      {transactionId}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      Game
                    </td>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#111827",
                        fontWeight: 500,
                        textAlign: "right",
                      }}
                    >
                      {gameName}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      Item
                    </td>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#111827",
                        fontWeight: 500,
                        textAlign: "right",
                      }}
                    >
                      {itemName}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      Amount
                    </td>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "14px",
                        color: "#10b981",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(amount)}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      Date
                    </td>
                    <td
                      style={{
                        padding: "8px 0",
                        fontSize: "13px",
                        color: "#111827",
                        fontWeight: 500,
                        textAlign: "right",
                      }}
                    >
                      {date}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr className="mx-0 my-[24px] w-full border border-[#e5e7eb] border-solid" />

            {/* Footer */}
            <Text className="m-0 text-center text-[12px] text-gray-500 leading-[20px]">
              Thank you for using FlazBit!
            </Text>
            <Text className="m-0 mt-[4px] text-center text-[12px] text-gray-400 leading-[20px]">
              If you have any questions, please contact our support team.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TransactionSuccessEmail;
