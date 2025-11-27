/**
 * Test script for legal document parser
 * Run with: node test-legal-parser.js
 */

const { parseLegalDocument, getSectionPath, getParentContext } = require('./app/lib/utils/legal-document-parser.ts');

// Sample legal text from § 77 GewO
const sampleText = `
§ 77. (1) Die Betriebsanlage ist zu genehmigen, wenn nach dem Stand der Technik (§ 71a) und dem
Stand  der  medizinischen  und  der  sonst  in  Betracht  kommenden  Wissenschaften  zu  erwarten  ist,  daß
überhaupt   oder   bei   Einhaltung   der   erforderlichenfalls   vorzuschreibenden   bestimmten   geeigneten
Auflagen  die  nach  den  Umständen  des  Einzelfalles  voraussehbaren  Gefährdungen  im  Sinne  des  § 74
Abs. 2  Z 1  vermieden  und  Belästigungen,  Beeinträchtigungen  oder  nachteilige  Einwirkungen  im  Sinne
des  § 74  Abs. 2  Z 2  bis  5  auf  ein  zumutbares  Maß  beschränkt  werden.

(2)  Ob  Belästigungen  der  Nachbarn  im  Sinne  des  § 74  Abs. 2  Z 2  zumutbar  sind,  ist  danach  zu
beurteilen,  wie  sich  die  durch  die  Betriebsanlage  verursachten  Änderungen  der  tatsächlichen  örtlichen
Verhältnisse auf ein gesundes, normal empfindendes Kind und auf einen gesunden, normal empfindenden
Erwachsenen auswirken.

(3) Die  Behörde  hat  Emissionen  von  Luftschadstoffen  jedenfalls  nach  dem  Stand  der  Technik
(§ 71a) zu begrenzen.

§ 78. (1) Die Behörde kann die Genehmigung mit Auflagen verbinden. Z 1 Erste Auflage hier. Z 2 Zweite Auflage hier.
`;

console.log('='.repeat(70));
console.log('LEGAL DOCUMENT PARSER TEST');
console.log('='.repeat(70));

try {
  const parsed = parseLegalDocument(sampleText);

  console.log('\n📊 METADATA:');
  console.log(JSON.stringify(parsed.metadata, null, 2));

  console.log('\n📚 SECTIONS FOUND:');
  console.log(`Total sections: ${parsed.sections.length}`);

  parsed.sections.forEach((section, i) => {
    console.log(`\n${i + 1}. ${section.identifier} (${section.type}, level ${section.level})`);
    console.log(`   Text preview: ${section.text.substring(0, 100)}...`);
    console.log(`   Position: ${section.startIndex} - ${section.endIndex}`);
    console.log(`   Children: ${section.children.length}`);

    if (section.children.length > 0) {
      section.children.forEach((child, j) => {
        console.log(`   ${j + 1}. ${child.identifier} (${child.type}, level ${child.level})`);
        console.log(`      Text preview: ${child.text.substring(0, 80)}...`);
        console.log(`      Children: ${child.children.length}`);

        if (child.children.length > 0) {
          child.children.forEach((grandchild, k) => {
            console.log(`      ${k + 1}. ${grandchild.identifier} (${grandchild.type}, level ${grandchild.level})`);
            console.log(`         Text preview: ${grandchild.text.substring(0, 60)}...`);
          });
        }
      });
    }
  });

  console.log('\n' + '='.repeat(70));
  console.log('✅ PARSER TEST COMPLETED');
  console.log('='.repeat(70));

} catch (error) {
  console.error('\n❌ ERROR:', error);
  console.error(error.stack);
  process.exit(1);
}
