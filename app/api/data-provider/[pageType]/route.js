import { dataProvider } from '@newscorp-djcs/sonata-core/common/data-provider';
import { NextResponse } from 'next/server';

import * as pageContent from '@/src/services/pageContent';

export async function GET(_, extras) {
  try {
    const { params } = extras;
    const pageType = params?.pageType;

    if (!pageContent[pageType]) throw new Error('Invalid page type');

    const { collectionIds, searchQueries } = pageContent[pageType];

    const promises = [dataProvider('collection', collectionIds), dataProvider('keywords', searchQueries)];
    // Asynchronously fulfill all promises
    // (regardless of completion order)
    const allPromises = await Promise.all(promises);

    return NextResponse.json(allPromises);
  } catch (err) {
    return NextResponse.json({ error: err?.message ?? 'Something went wrong', status: 400 });
  }
}
