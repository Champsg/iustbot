// Simulating Supabase response behavior for .single() when no rows found
const checkError = { code: 'PGRST116', message: 'The result contains 0 rows' };
const existing = null;

if (!existing && !checkError) {
    console.log('Condition met! (This is what the code expects for new notices)');
} else {
    console.log('Condition failed! existing:', existing, 'checkError:', checkError);
}

// How it SHOULD be checked:
if (!existing) {
    console.log('Correct check: New notice found!');
}
