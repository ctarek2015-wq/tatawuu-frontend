import CampaignGrid from "../CampaignGrid/CampaignGrid";

const ExplorePage = ({ campaigns }) => {

    return (
        <>
            <CampaignGrid campaigns={campaigns} />
        </>
    )
}

export default ExplorePage;