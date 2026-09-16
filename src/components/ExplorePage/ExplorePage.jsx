import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as campaignService from "../../services/campaignService.js";
import CampaignGrid from "../CampaignGrid/CampaignGrid.jsx";
import { categories, governorates } from "../../utils/options.js";
import { dateOnly } from "../../utils/dates.js";

const emptyFilters = { search: "", governorate: "", area: "", category: "", from: "", to: "" };

const ExplorePage = () => {
  const { orgId } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setCampaigns(await campaignService.index());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  const handleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
    setPage(1);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const text = `${campaign.title} ${campaign.organizationId?.name || ""}`.toLowerCase();
    const date = dateOnly(campaign.startsAt);
    return new Date(campaign.startsAt) > new Date()
      && (!orgId || campaign.organizationId?._id === orgId)
      && text.includes(filters.search.toLowerCase())
      && (!filters.governorate || campaign.governorate === filters.governorate)
      && campaign.area.toLowerCase().includes(filters.area.toLowerCase())
      && (!filters.category || campaign.category === filters.category)
      && (!filters.from || date >= filters.from)
      && (!filters.to || date <= filters.to);
  });
  const pages = Math.max(1, Math.ceil(filteredCampaigns.length / 6));
  const shownPage = Math.min(page, pages);
  const visibleCampaigns = filteredCampaigns.slice((shownPage - 1) * 6, shownPage * 6);

  return (
    <main>
      <h1>Volunteer in Bahrain</h1>
      <p>Find a local activity and make time for your community.</p>
      <div>
        <label>Search <input name="search" value={filters.search} onChange={handleChange} placeholder="Activity or organization" /></label>
        <label>Governorate <select name="governorate" value={filters.governorate} onChange={handleChange}>
          <option value="">All governorates</option>
          {governorates.map((governorate) => <option key={governorate}>{governorate}</option>)}
        </select></label>
        <label>Area <input name="area" value={filters.area} onChange={handleChange} /></label>
        <label>Category <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select></label>
        <label>From date <input type="date" name="from" value={filters.from} onChange={handleChange} /></label>
        <label>To date <input type="date" name="to" value={filters.to} onChange={handleChange} /></label>
        <button type="button" onClick={() => { setFilters(emptyFilters); setPage(1); }}>Clear filters</button>
      </div>
      <h2>Upcoming activities</h2>
      {loading && <p>Loading activities...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <>
        <CampaignGrid campaigns={visibleCampaigns} />
        <button type="button" disabled={shownPage === 1} onClick={() => setPage(shownPage - 1)}>Previous</button>
        <span> Page {shownPage} of {pages} </span>
        <button type="button" disabled={shownPage === pages} onClick={() => setPage(shownPage + 1)}>Next</button>
      </>}
    </main>
  );
};

export default ExplorePage;
