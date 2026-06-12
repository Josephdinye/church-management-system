// app/api/auth/[...nextauth]/route.ts
import { GET as authGET, POST as authPOST } from '@/lib/auth';

export const GET = authGET;
export const POST = authPOST;