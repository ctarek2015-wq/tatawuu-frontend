import CampaignCard from "../CampaignCard/CampaignCard";


const CampaignGrid = ({ campaigns }) => {

    // Search functions

    // Filter functions


    return (
        <>
            <div>
            {campaigns.map((campaign) => (
                <CampaignCard campaign={campaign} />
            ))}
            </div>
        </>
    )
}

export default CampaignGrid;