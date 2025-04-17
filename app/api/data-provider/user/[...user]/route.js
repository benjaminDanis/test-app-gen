import { dataProvider } from '@newscorp-djcs/sonata-core/common/data-provider';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
const BUNDLE = JSON.parse(process.env.BUNDLE || '[]');
const areAllBundlesIncludedInRoles = (bundle, roles) => bundle.every((service) => roles.includes(service));

// Handle requests to /api/data-provider/user with Authorization headers
export async function GET(request) {
  let authorization;
  try {
    const headersList = headers();
    authorization = headersList?.get('authorization');
  } catch (err) {
    // Handle dynamic server error: https://nextjs.org/docs/messages/dynamic-server-error
    ({ authorization } = request.headers);
  }
  try {
    const jwt = authorization?.slice(7);

    if (!jwt) throw new Error('Invalid authorization header');

    const userData = await dataProvider('user', jwt);
    const { roles = [], preferences: { companies, industries } = {} } = userData || {};
    // Use this to check when user entitlements includes a specific role
    if (!areAllBundlesIncludedInRoles(BUNDLE, roles)) throw new Error('Invalid user role');

    // const { preferences: { licenseKey } = {} } = userData || {};
    // if (!licenseKey) throw new Error('Invalid license');

    return NextResponse.json({
      ...userData,
      user: {
        ...(userData?.user || {}),
        preferences: {
          companies: companies || [],
          industries: industries || [],
        },
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message ?? 'Something went wrong', status: 400 });
  }
}
