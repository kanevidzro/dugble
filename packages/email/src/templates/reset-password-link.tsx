import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";

export default function ResetPasswordLink({
  email = "panic@thedis.co",
  url = "http://localhost:8888/auth/reset-password?token=some-token",
}: {
  email: string;
  url: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset Password Link</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-150 rounded border border-solid border-neutral-200 px-10 py-5">
            <Heading className="mx-0 my-7 p-0 text-xl font-medium text-black">
              Reset password link
            </Heading>
            <Text className="text-sm leading-6 text-black">
              You are receiving this email because we received a password reset
              request for your account at Dugble.
            </Text>
            <Text className="text-sm leading-6 text-black">
              Please click the button below to reset your password.
            </Text>
            <Section className="my-8 mt-8">
              <Link
                className="rounded-lg bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Reset Password
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              or copy and paste this URL into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap wrap-break-words font-medium text-purple-600 no-underline">
              {url.replace(/^https?:\/\//, "")}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
