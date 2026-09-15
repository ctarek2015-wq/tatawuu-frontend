import CampaignGrid from "../CampaignGrid/CampaignGrid";

const ExplorePage = ({ campaigns }) => {

    return (
        <>

          <h2>Volunteer in Bahrain.</h2>
          <p> Finde a local activity and make time for you'r community .</p>



          <h6>Search activity</h6>


         <div class="filters">
          <input type="text" placeholder="Search by activity or organization" />
          <button  >search</button>


          <h6>Governorate</h6>
           <input type="text"  />

           <h6>Area</h6>
           <input type="text" placeholder="Area name" />

           <h6>Category</h6>
           <input type="text"  />

           <h6>From Date</h6>
           <input type="date"  />

           <h6>To Date</h6>
           <input type="date"  />


          </div>


          <button>Clear Filters</button>

          <h2>Upcommings Activity</h2>




            <CampaignGrid campaigns={campaigns} />



           <button disabled>Previous</button>
            <span>1</span>
            <button>Next</button>

        </>
    )
}

export default ExplorePage;