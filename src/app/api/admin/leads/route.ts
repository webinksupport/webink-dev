import { NextResponse } from 'next/server'

// Sample lead data — replace with Google Places API when key is configured
const sampleLeads = [
  { id: '1', name: 'Sunshine Bistro', type: 'Restaurant', address: '123 Main St, Sarasota, FL 34236', phone: '(941) 555-0101', website: '', hasSSL: false, mobileFriendly: false, modernDesign: false, score: 0 },
  { id: '2', name: 'Gulf Coast Plumbing', type: 'Contractor', address: '456 Bee Ridge Rd, Sarasota, FL 34233', phone: '(941) 555-0202', website: 'http://gulfcoastplumbing.com', hasSSL: false, mobileFriendly: false, modernDesign: false, score: 15 },
  { id: '3', name: 'Bayfront Dental', type: 'Medical', address: '789 Tamiami Trail, Sarasota, FL 34236', phone: '(941) 555-0303', website: 'https://bayfrontdental.com', hasSSL: true, mobileFriendly: true, modernDesign: false, score: 55 },
  { id: '4', name: 'Paradise Pet Grooming', type: 'Retail', address: '321 Clark Rd, Sarasota, FL 34233', phone: '(941) 555-0404', website: '', hasSSL: false, mobileFriendly: false, modernDesign: false, score: 0 },
  { id: '5', name: 'Coastal Fitness Studio', type: 'Medical', address: '555 Siesta Key Cir, Sarasota, FL 34242', phone: '(941) 555-0505', website: 'http://coastalfitness.net', hasSSL: false, mobileFriendly: true, modernDesign: false, score: 30 },
  { id: '6', name: 'Sarasota Auto Detail', type: 'Contractor', address: '678 Fruitville Rd, Sarasota, FL 34236', phone: '(941) 555-0606', website: '', hasSSL: false, mobileFriendly: false, modernDesign: false, score: 0 },
  { id: '7', name: 'Island Yoga Retreat', type: 'Medical', address: '901 Lido Key, Sarasota, FL 34236', phone: '(941) 555-0707', website: 'http://islandyoga.com', hasSSL: false, mobileFriendly: false, modernDesign: true, score: 35 },
  { id: '8', name: 'Mangrove Realty Group', type: 'Retail', address: '234 Palm Ave, Sarasota, FL 34236', phone: '(941) 555-0808', website: 'https://mangroverealty.com', hasSSL: true, mobileFriendly: true, modernDesign: true, score: 85 },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  let results = [...sampleLeads]
  if (type && type !== 'all') {
    results = results.filter(l => l.type === type)
  }

  return NextResponse.json({
    leads: results,
    note: 'Using sample data. Configure Google Places API key in Admin > Integrations to search real businesses.'
  })
}
