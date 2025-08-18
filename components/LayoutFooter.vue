<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFacebookF, faXTwitter, faLinkedinIn, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { MoveUpRight } from "lucide-vue-next";
</script>

<template>
    <footer class="bg-gradient-to-b from-[#082e41] to-[#00718b] text-white pt-24 pb-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-3 text-base font-[600]">
                <div class="flex flex-col gap-4">
                    <h3 class="text-xl font-bold">Related websites</h3>
                    <a href="https://portal.ga.gov.au/" target="_blank" rel="noopener noreferrer">Geoscience Australia Portal</a>
                    <a href="https://digital.atlas.gov.au/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center">Digital Atlas of Australia <MoveUpRight class="size-4 ml-2" /></a>
                </div>
                <div class="flex flex-col gap-4">
                    <h3 class="text-xl">Useful tools</h3>
                    <a href="https://ecat.ga.gov.au/geonetwork/srv/eng/catalog.search#/home" target="_blank" rel="noopener noreferrer">Search data &amp; publications</a>
                    <a href="https://earthquakes.ga.gov.au/" target="_blank" rel="noopener noreferrer">Recent earthquakes</a>
                </div>
                <div class="flex flex-col gap-4">
                    <h3 class="text-xl">Connect with us</h3>
                    <div class="flex flex-row gap-2 text-2xl">
                        <a href="https://www.facebook.com/GeoscienceAustralia" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon :icon="faFacebookF" />
                        </a>
                        <a href="https://twitter.com/GeoscienceAus" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon :icon="faXTwitter" />
                        </a>
                        <a href="https://au.linkedin.com/company/geoscience-australia" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon :icon="faLinkedinIn" />
                        </a>
                        <a href="https://www.instagram.com/geoscienceaustralia" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon :icon="faInstagram" />
                        </a>
                        <a href="http://www.youtube.com/user/GeoscienceAustralia" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon :icon="faYoutube" />
                        </a>
                    </div>
                </div>
            </div>
            <hr class="my-12 opacity-25" />
            <div class="text-sm">
                <p>
                    Geoscience Australia values the lands, water and sky as we work to deepen a shared understanding of Country and Earth. We respect First Nations peoples and their enduring connection, contribution and obligations to Country. Reflecting on our shared history, we are committed to listen and learn.
                </p>
            </div>
            <div class="flex flex-row gap-6 text-sm font-[600] mt-6">
                <a href="https://www.ga.gov.au/contact-us" target="_blank" rel="noopener noreferrer">Contact us</a>
                <a href="https://www.ga.gov.au/copyright" target="_blank" rel="noopener noreferrer">Copyright</a>
                <a href="https://www.ga.gov.au/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
                <a href="https://www.ga.gov.au/accessibility" target="_blank" rel="noopener noreferrer">Accessibility</a>
                <a href="https://www.ga.gov.au/ips" target="_blank" rel="noopener noreferrer">Information Publication Scheme</a>
                <a href="https://www.ga.gov.au/ips/foi" target="_blank" rel="noopener noreferrer">Freedom of Information Act</a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
a {
    color: white !important;
}
</style>