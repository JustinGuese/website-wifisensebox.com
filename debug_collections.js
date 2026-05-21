
import { getCollection } from 'astro:content';

async function debug() {
  const categories = await getCollection('categories');
  console.log('Categories:');
  categories.forEach(cat => {
    console.log(`ID: ${cat.id}, Locale: ${cat.data.locale}, Split[0]: ${cat.id.split('.')[0]}`);
  });

  const usecases = await getCollection('usecases');
  console.log('\nUse Cases:');
  usecases.forEach(uc => {
    console.log(`ID: ${uc.id}, Category: ${uc.data.category}, Locale: ${uc.data.locale}, Split[0]: ${uc.id.split('.')[0]}`);
  });
}

// Since I cannot easily run this in the context of Astro from here without a lot of setup,
// I will just trust my gut and look at the code again.
