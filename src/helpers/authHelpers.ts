import { JoinNowPage } from '@pages/JoinNowPage';

/**
 * Opens Join Now page and submits signup with the given credentials.
 * Use for happy-path or any test that needs "open page + sign up" in one step.
 */
export async function goToJoinNowAndSignUp(
  joinNowPage: JoinNowPage,
  email: string,
  password: string,
): Promise<void> {
  await joinNowPage.gotoAndWait();
  await joinNowPage.signUp(email, password);
}
