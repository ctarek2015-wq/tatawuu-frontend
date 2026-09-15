import { useState } from 'react';
import CampaignGrid from "../CampaignGrid/CampaignGrid";

const ExplorePage = ({ campaigns }) => {



    const [searchTerm, setSearchTerm] = useState('');
    const [governorate, setGovernorate] = useState('');
    const [area, setArea] = useState('');
    const [category, setCategory] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


const governoratesList = ['Capital', 'Muharraq', 'Northern', 'Southern'];


const categoriesList = ['Environment', 'Education', 'Health', 'Social Welfare', 'Food Packing'];



const filteredCampaigns = campaigns.filter(campaign => {

    const matchesSearch = searchTerm === '' || 
            campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase());


        const matchesGovernorate = governorate === '' || campaign.governorate === governorate;

        const matchesArea = area === '' || campaign.area?.toLowerCase().includes(area.toLowerCase());

        const matchesCategory = category === '' || campaign.category === category;

        const matchesFromDate = !fromDate || new Date(campaign.date) >= new Date(fromDate);
        const matchesToDate = !toDate || new Date(campaign.date) <= new Date(toDate);

        return matchesSearch && matchesGovernorate && matchesArea && matchesCategory && matchesFromDate && matchesToDate;
    });



    const handleClearFilters = () => {
        setSearchTerm('');
        setGovernorate('');
        setArea('');
        setCategory('');
        setFromDate('');
        setToDate('');
    };




    return (
        <>

          <h2>Volunteer in Bahrain.</h2>
          <p> Finde a local activity and make time for you'r community .</p>



          <h6>Search activity</h6>


         <div className="filters">
               <input 
                    type="text" 
                    placeholder="Search by activity or organization" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />         
                 <button  >search</button>


          <h6>Governorate</h6>
          <select 
                    value={governorate} 
                    onChange={(e) => setGovernorate(e.target.value)}
                >
                    <option value="">All governorates</option>
                    {governoratesList.map((gov) => (
                        <option key={gov} value={gov}>{gov} Governorate</option>
                    ))}
                </select>

           <h6>Area</h6>
            <input 
                    type="text" 
                    placeholder="Area name" 
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                />



           <h6>Category</h6>
               <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All categories</option>
                    {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>


           <h6>From Date</h6>
           <input type="date"  />

           <h6>To Date</h6>
           <input type="date"  />


          </div>


         <button onClick={handleClearFilters}>Clear Filters</button>

          <h2>Upcommings Activity</h2>




            <CampaignGrid campaigns={filteredCampaigns} />


            <button disabled>Previous</button>
            <span>1</span>
            <button>Next</button> 

        </>
    )
}

export default ExplorePage;