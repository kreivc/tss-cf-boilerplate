import {
  Body,
  Head,
  Heading,
  Html,
  Preview,
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
      <Body
        style={{
          backgroundColor: "#f4f4f5",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Outer wrapper table for centering */}
        <table
          align="center"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{
            backgroundColor: "#f4f4f5",
            margin: 0,
            padding: 0,
          }}
          width="100%"
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "40px 20px" }}>
                {/* Main content container */}
                <table
                  align="center"
                  cellPadding={0}
                  cellSpacing={0}
                  role="presentation"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e4e4e7",
                    maxWidth: "480px",
                  }}
                  width="480"
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "32px 32px 24px 32px" }}>
                        {/* Header - Check Icon */}
                        <table
                          cellPadding={0}
                          cellSpacing={0}
                          role="presentation"
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <td align="center">
                                <div
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "#ecfdf5",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    lineHeight: "48px",
                                    textAlign: "center",
                                    fontSize: "24px",
                                  }}
                                >
                                  ✓
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="center"
                                style={{
                                  paddingTop: "16px",
                                  paddingBottom: "8px",
                                }}
                              >
                                <Heading
                                  as="h1"
                                  style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: 600,
                                    color: "#18181b",
                                    textAlign: "center",
                                  }}
                                >
                                  Top-up Successful!
                                </Heading>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Greeting */}
                        <Text
                          style={{
                            margin: "24px 0 8px 0",
                            fontSize: "15px",
                            color: "#3f3f46",
                            lineHeight: "24px",
                          }}
                        >
                          Hi {customerName},
                        </Text>
                        <Text
                          style={{
                            margin: "0 0 24px 0",
                            fontSize: "15px",
                            color: "#3f3f46",
                            lineHeight: "24px",
                          }}
                        >
                          Your top-up has been completed successfully. Here are
                          your transaction details:
                        </Text>

                        {/* Transaction Details Box */}
                        <table
                          bgcolor="#fafafa"
                          cellPadding={0}
                          cellSpacing={0}
                          role="presentation"
                          style={{
                            backgroundColor: "#fafafa",
                            borderRadius: "8px",
                            border: "1px solid #e4e4e7",
                          }}
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <td style={{ padding: "20px" }}>
                                {/* Transaction ID Row */}
                                <table
                                  cellPadding={0}
                                  cellSpacing={0}
                                  role="presentation"
                                  width="100%"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#71717a",
                                          verticalAlign: "top",
                                        }}
                                      >
                                        Transaction ID
                                      </td>
                                      <td
                                        align="right"
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#18181b",
                                          fontWeight: 500,
                                          verticalAlign: "top",
                                          wordBreak: "break-all",
                                        }}
                                      >
                                        {transactionId}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#71717a",
                                        }}
                                      >
                                        Game
                                      </td>
                                      <td
                                        align="right"
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#18181b",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {gameName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#71717a",
                                        }}
                                      >
                                        Item
                                      </td>
                                      <td
                                        align="right"
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#18181b",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {itemName}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#71717a",
                                        }}
                                      >
                                        Amount
                                      </td>
                                      <td
                                        align="right"
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "15px",
                                          color: "#10b981",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {formatCurrency(amount)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#71717a",
                                        }}
                                      >
                                        Date
                                      </td>
                                      <td
                                        align="right"
                                        style={{
                                          padding: "8px 0",
                                          fontSize: "14px",
                                          color: "#18181b",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {date}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: "24px 32px 32px 32px",
                          borderTop: "1px solid #e4e4e7",
                        }}
                      >
                        <Text
                          style={{
                            margin: 0,
                            textAlign: "center",
                            fontSize: "13px",
                            color: "#71717a",
                            lineHeight: "20px",
                          }}
                        >
                          Thank you for using FlazBit!
                        </Text>
                        <Text
                          style={{
                            margin: "4px 0 0 0",
                            textAlign: "center",
                            fontSize: "13px",
                            color: "#a1a1aa",
                            lineHeight: "20px",
                          }}
                        >
                          If you have any questions, please contact our support
                          team.
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </Body>
    </Html>
  );
};

export default TransactionSuccessEmail;
