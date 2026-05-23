import { Router } from "express";

import { list as localProducerList, single as LocalProducerSingle } from "../Controller/LocalProducer";
import { list as orgCategoryItemList } from "../Controller/Organization/Category/Item";

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
import { single as placeSingle, list as placeList, nearestActivity as placeNearAct, nearestBeaches as placeNearBeach, nearestOrganizations as placeNearOrg } from "../Controller/Place";

// --- BEACH CONTROLLER IMPORTS ---
import { show as beachShow, single as beacSingle, list as beachList, nearestActivity as beachNearAct, nearestOrganizations as beachNearOrg, nearestPlaces as beachNearPlace } from "../Controller/Beach";

// --- ORGANIZATION & FEATURED CONTROLLER IMPORTS ---
import { show as orgShow, single as orgSingle, list as orgList, nearestActivity as orgNearAct, nearestBeaches as orgNearBeach, nearestPlaces as orgNearPlace } from "../Controller/Organization";
import { list as featuredOrgList } from "../Controller/HighlightedOrganization";

// --- ACTIVITY CONTROLLER IMPORTS ---
import { show as activityShow, single as ActivitySingle, list as activityList, nearestBeaches as actNearBeach, nearestPlaces as actNearPlace, nearestOrganizations as actNearOrg } from "../Controller/Activity";

import { getLaunchPopup } from "../Controller/Config";
import { list as notificationList } from "../Controller/Notification";

import { list as exploreFeedList } from "../Controller/ExploreFeed";

const router = Router();

//LOCAL PRODUCER
router.get("/local_producer/list", localProducerList);
router.get("/local_producer/:id/single", LocalProducerSingle);

router.get("/explore_feed/list", exploreFeedList);

// --- ORGANIZATION CATEGORY (İşletme Kategorileri) ---
router.get("/organization/category/list", orgCatList);

// --- ACTIVITY CATEGORY (Etkinlik Kategorileri) ---
router.get("/activity/category/list", activityCatList);

// --- VILLAGE (Köyler) ---
router.get("/village/list", villageList);

// --- PLACE (Gezilecek Yerler) ---
router.get("/place/list", placeList);
router.get("/place/:id/nearest-activity", placeNearAct);
router.get("/place/:id/nearest-beaches", placeNearBeach);
router.get("/place/:id/nearest-organizations", placeNearOrg);
router.get("/place/:id/single", placeSingle),

// --- BEACH (Plajlar) ---
router.get("/beach/list", beachList);
router.get("/beach/:id/single", beacSingle);
router.get("/beach/:id/nearest-activity", beachNearAct);
router.get("/beach/:id/nearest-organizations", beachNearOrg);
router.get("/beach/:id/nearest-places", beachNearPlace);

// --- ORGANIZATION (İşletmeler) ---
router.get("/organization/:id/single", orgSingle)
router.get("/organization/list", orgList);
router.get("/organization/featured", featuredOrgList);

router.get("/organization/:id/nearest-activity", orgNearAct);
router.get("/organization/:id/nearest-beaches", orgNearBeach);
router.get("/organization/:id/nearest-places", orgNearPlace);
router.get("/organization/category/item/list", orgCategoryItemList);

// --- ACTIVITY (Etkinlikler) ---
router.get("/activity/list", activityList);
router.get("/activity/:id/single", ActivitySingle)
router.get("/activity/:id/nearest-beaches", actNearBeach);
router.get("/activity/:id/nearest-places", actNearPlace);
router.get("/activity/:id/nearest-organizations", actNearOrg);

router.get("/config/launch-popup", getLaunchPopup);
router.get("/notification/list", notificationList);

export default router;