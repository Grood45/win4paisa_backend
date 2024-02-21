
const express=require("express");
const { GetAllMatches, GetTennisMatches, GetCricketMatches, GetSoccerMatches, GetSingleMatch, UpdateMatchLogo, ToggleMatchStatus, GetAdminSportsCount, GetAllQuestion, UpdateMatchId } = require("../controllers/match.controller");

MatchRoute=express.Router()
MatchRoute.get("/get-all-match", GetAllMatches);
MatchRoute.get("/get-tennis-match", GetTennisMatches);
MatchRoute.get("/get-cricket-match", GetCricketMatches);
MatchRoute.get("/get-soccer-match", GetSoccerMatches);
MatchRoute.get("/get-single-match/:match_id", GetSingleMatch);
MatchRoute.patch("/update-team-logo/:match_id", UpdateMatchLogo);
MatchRoute.patch("/update-match-status/:match_id", ToggleMatchStatus);
MatchRoute.get("/get-admin-sports-count", GetAdminSportsCount);
MatchRoute.get("/get-all-question", GetAllQuestion);
MatchRoute.patch("/update-match_id/:id",UpdateMatchId)


module.exports={MatchRoute}