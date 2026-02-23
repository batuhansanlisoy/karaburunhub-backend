import { Router } from "express";

// --- CATEGORY IMPORTS (Activity & Organization) ---
import { 
    show as activityCatShow, 
    list as activityCatList 
} from "../Controller/Activity/Category";
import { 
    show as orgCatShow, 
    list as orgCatList 
} from "../Controller/Organization/Category";

// --- VILLAGE CONTROLLER IMPORTS ---
import { show as villageShow, list as villageList } from "../Controller/Village";

// --- PLACE CONTROLLER IMPORTS ---
import { show as placeShow, list as placeList, nearestActivity as placeNearAct, nearestBeaches as placeNearBeach, nearestOrganizations as placeNearOrg } from "../Controller/Place";

// --- BEACH CONTROLLER IMPORTS ---
import { show as beachShow, list as beachList, nearestActivity as beachNearAct, nearestOrganizations as beachNearOrg, nearestPlaces as beachNearPlace } from "../Controller/Beach";

// --- ORGANIZATION & FEATURED CONTROLLER IMPORTS ---
import { show as orgShow, list as orgList, nearestActivity as orgNearAct, nearestBeaches as orgNearBeach, nearestPlaces as orgNearPlace } from "../Controller/Organization";
import { list as featuredOrgList } from "../Controller/FeaturedOrganization";

// --- ACTIVITY CONTROLLER IMPORTS ---
import { show as activityShow, list as activityList, nearestBeaches as actNearBeach, nearestPlaces as actNearPlace, nearestOrganizations as actNearOrg } from "../Controller/Activity";

const router = Router();

// --- ORGANIZATION CATEGORY (İşletme Kategorileri) ---
router.get("/organization/category/list", orgCatList);
router.get("/organization/category/:id", orgCatShow);

// --- ACTIVITY CATEGORY (Etkinlik Kategorileri) ---
router.get("/activity/category/list", activityCatList);
router.get("/activity/category/:id", activityCatShow);

// --- VILLAGE (Köyler) ---
router.get("/village/list", villageList);
router.get("/village/:id", villageShow);

// --- PLACE (Gezilecek Yerler) ---
router.get("/place/list", placeList);
router.get("/place/:id", placeShow);
router.get("/place/:id/nearest-activity", placeNearAct);
router.get("/place/:id/nearest-beaches", placeNearBeach);
router.get("/place/:id/nearest-organizations", placeNearOrg);

// --- BEACH (Plajlar) ---
router.get("/beach/list", beachList);
router.get("/beach/:id", beachShow);
router.get("/beach/:id/nearest-activity", beachNearAct);
router.get("/beach/:id/nearest-organizations", beachNearOrg);
router.get("/beach/:id/nearest-places", beachNearPlace);

// --- ORGANIZATION (İşletmeler) ---
router.get("/organization/list", orgList);
router.get("/organization/featured", featuredOrgList);
router.get("/organization/:id", orgShow);
router.get("/organization/:id/nearest-activity", orgNearAct);
router.get("/organization/:id/nearest-beaches", orgNearBeach);
router.get("/organization/:id/nearest-places", orgNearPlace);

// --- ACTIVITY (Etkinlikler) ---
router.get("/activity/list", activityList);
router.get("/activity/:id", activityShow);
router.get("/activity/:id/nearest-beaches", actNearBeach);
router.get("/activity/:id/nearest-places", actNearPlace);
router.get("/activity/:id/nearest-organizations", actNearOrg);

export default router;