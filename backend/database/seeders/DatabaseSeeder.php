<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use App\Models\WorkReport;
use App\Models\Coverage;
use App\Models\CoverageLink;
use App\Models\Experience;
use App\Models\Article;
use App\Models\ArticleLink;
use App\Models\AboutContent;
use App\Models\Certification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::firstOrCreate(
            ['email' => 'admin@haidar.com'],
            ['name' => 'Haidar Mustafa', 'password' => Hash::make('admin123')]
        );

        // Settings
        $defaults = [
            'hero_kicker_en'      => 'Syrian Journalist — 14 Years in the Field',
            'hero_kicker_ar'      => 'صحفي سوري — 14 عاماً في الميدان',
            'hero_tagline_en'     => 'Covering conflicts, politics, and human stories across the Middle East.',
            'hero_tagline_ar'     => 'تغطية الصراعات والسياسة والقصص الإنسانية عبر الشرق الأوسط.',
            'showreel_url'        => '',
            'showreel_caption_en' => 'FIELD REPORTING · LIVE BROADCASTING · CONFLICT COVERAGE · PHOTOJOURNALISM',
            'showreel_caption_ar' => 'تقارير ميدانية · بث مباشر · تغطية نزاعات · تصوير صحفي',
            'stats_json'          => json_encode([
                ['n'=>'14+','l_en'=>'Years Experience','l_ar'=>'سنة خبرة'],
                ['n'=>'3',  'l_en'=>'Countries',       'l_ar'=>'دول'],
                ['n'=>'12', 'l_en'=>'Media Orgs',      'l_ar'=>'مؤسسة إعلامية'],
                ['n'=>'4',  'l_en'=>'Roles',           'l_ar'=>'أدوار'],
                ['n'=>'∞',  'l_en'=>'Human Stories',   'l_ar'=>'قصة إنسانية'],
            ]),
            'orgs_json'           => json_encode([
                ['name'=>'Reuters','wire'=>true],['name'=>'AFP','wire'=>true],['name'=>'Xinhua','wire'=>true],
                ['name'=>'Viory'],['name'=>'Ana Sooria TV'],['name'=>'Alghad TV'],
                ['name'=>'Syrian News Channel'],['name'=>'Raseef22'],['name'=>'The Cradle'],
                ['name'=>'Syria Untold'],['name'=>'Cham Times'],['name'=>'Sama TV'],
            ]),
            'contact_email'       => 'Haidarmustafa.media@gmail.com',
            'contact_phone'       => '+963 931 600 388',
            'contact_whatsapp'    => '+963 994 991 566',
            'contact_linkedin'    => 'haidar-mustafa-5a6b26174',
            'contact_location_en' => 'Syria — Damascus & Latakia',
            'contact_location_ar' => 'سوريا — دمشق واللاذقية',
        ];
        foreach ($defaults as $k => $v) Setting::set($k, $v);

        // Work Reports
        $reports = [
            ['src'=>'Xinhua','title_en'=>'Children of Salma Learn in Tents Built on the Ruins of War','title_ar'=>'أطفال سلمى يتعلمون في خيام بنيت على أنقاض الحرب','desc_en'=>'Field report from Latakia countryside — education continuing despite destruction left by years of conflict.','desc_ar'=>'تقرير ميداني من ريف اللاذقية.','link'=>'http://arabic.china.org.cn/txt/2025-10/20/content_118131531.htm','link_label_en'=>'Read Report','link_label_ar'=>'قراءة التقرير'],
            ['src'=>'Viory','title_en'=>'Syrian Beekeeper Loses 70%+ of Apiaries in Latakia Wildfires','title_ar'=>'نحّال سوري يخسر أكثر من 70% من مناحله في حرائق اللاذقية','desc_en'=>'A human-centered story on the economic and environmental impact of the devastating 2025 wildfires.','desc_ar'=>'قصة إنسانية عن الأثر الاقتصادي والبيئي.','link'=>'https://www.viory.video/en/videos/a3415_12072025','link_label_en'=>'Watch Report','link_label_ar'=>'مشاهدة التقرير'],
            ['src'=>'Viory','title_en'=>'Charity Kitchens Feed Thousands After Syria Earthquake','title_ar'=>'مطابخ خيرية تطعم الآلاف بعد زلزال سوريا','desc_en'=>'Humanitarian coverage documenting relief operations across Latakia in the aftermath of the 2023 earthquake.','desc_ar'=>'تغطية إنسانية توثّق عمليات الإغاثة.','link'=>'https://www.viory.video/en/videos/a3015_19022023','link_label_en'=>'Watch Report','link_label_ar'=>'مشاهدة التقرير'],
            ['src'=>'Reuters','title_en'=>"Life on Syria's Coast After Political Transition",'title_ar'=>'الحياة على الساحل السوري بعد التحول السياسي','desc_en'=>"Reporting on daily life, security, and social changes during Syria's political transformation.",'desc_ar'=>'تغطية للحياة اليومية والأمن والتغيرات الاجتماعية.','link'=>'https://youtu.be/9HoBeXiR0QA','link_label_en'=>'Watch Report','link_label_ar'=>'مشاهدة التقرير'],
        ];
        foreach ($reports as $i => $r) WorkReport::firstOrCreate(['title_en'=>$r['title_en']],array_merge($r,['sort_order'=>$i]));

        // Coverages
        $coverages = [
            ['name_en'=>'Iraqi Protests','name_ar'=>'احتجاجات العراق','year'=>'2019','desc_en'=>"Field reporting from Baghdad's Tahrir Square.",'desc_ar'=>'تغطية ميدانية من ساحة التحرير.','links'=>[['label'=>'Tahrir Square Rally','url'=>'https://www.viory.video/en/videos/a3064_20122019'],['label'=>'Baghdad Freestyle','url'=>'https://www.viory.video/en/videos/a3009_31122019']]],
            ['name_en'=>'Turkey-Syria Earthquake','name_ar'=>'زلزال تركيا وسوريا','year'=>'2023','desc_en'=>'Field and humanitarian coverage — rescue operations, relief efforts.','desc_ar'=>'تغطية ميدانية وإنسانية.','links'=>[['label'=>'Report 1','url'=>'https://www.youtube.com/watch?v=qD1O930DzyI'],['label'=>'Report 2','url'=>'https://www.youtube.com/watch?v=aPqB7lA-cps'],['label'=>'Charity Kitchens','url'=>'https://www.viory.video/en/videos/a3015_19022023']]],
            ['name_en'=>'Political Transition in Syria','name_ar'=>'التحول السياسي في سوريا','year'=>'2024–2025','desc_en'=>"Contributed to Reuters and international coverage of Latakia and Syria's coastal region.",'desc_ar'=>'مساهمة في تغطية رويترز والإعلام الدولي.','links'=>[['label'=>'Reuters — UN Report','url'=>'https://www.reuters.com/world/middle-east/un-says-entire-families-killed-syria-military-operation-2025-03-11/'],['label'=>'Report 1','url'=>'https://www.youtube.com/watch?v=MjvUS6Y8Nlg'],['label'=>'Report 2','url'=>'https://www.youtube.com/watch?v=itNeXenRjo4']]],
            ['name_en'=>'Latakia Wildfires','name_ar'=>'حرائق اللاذقية','year'=>'2025','desc_en'=>'Emergency field reporting — response operations, environmental damage.','desc_ar'=>'تغطية ميدانية طارئة.','links'=>[['label'=>'Firefighters Join','url'=>'https://www.viory.video/en/videos/a3458_10072025'],['label'=>'Beekeeper Story','url'=>'https://www.viory.video/en/videos/a3415_12072025']]],
        ];
        foreach ($coverages as $i => $c) {
            $links = $c['links']; unset($c['links']);
            $cov = Coverage::firstOrCreate(['name_en'=>$c['name_en']],array_merge($c,['sort_order'=>$i]));
            if ($cov->links()->count()===0) foreach($links as $j=>$l) CoverageLink::create(['coverage_id'=>$cov->id,'label'=>$l['label'],'url'=>$l['url'],'sort_order'=>$j]);
        }

        // Experience
        $exp = [
            ['years'=>'2019 — Present','org'=>'Viory','role_en'=>'Stringer & Regional Coordinator','role_ar'=>'مراسل ومنسق إقليمي','bullets_en'=>['Field production across Syria, Lebanon, Iraq','Political, conflict, and humanitarian reporting','Coordinating 50+ field journalists across Lebanon, Iraq, Libya','International news coverage and multimedia production'],'bullets_ar'=>['إنتاج ميداني عبر سوريا ولبنان والعراق','تغطية سياسية وإنسانية وتغطية النزاعات','تنسيق أكثر من 50 صحفياً ميدانياً','تغطية إخبارية دولية'],'links'=>[['label'=>'Latakia Wildfires','url'=>'https://www.viory.video/en/videos/a3458_10072025'],['label'=>'Beekeeper Story','url'=>'https://www.viory.video/en/videos/a3415_12072025']]],
            ['years'=>'2020 — Present','org'=>'Reuters · AFP · Xinhua','role_en'=>'Freelance Photojournalist','role_ar'=>'مصوّر صحفي مستقل','bullets_en'=>['International wire agency photojournalism','Conflict, protest, and humanitarian photography',"Syria's political transition"],'bullets_ar'=>['تصوير صحفي لوكالات الأنباء الدولية','تصوير النزاعات والاحتجاجات','التحول السياسي في سوريا'],'links'=>[['label'=>'Reuters Connect','url'=>'https://www.reutersconnect.com/item/people-queue-in-front-of-a-bakery-in-latakia/dGFnOnJldXRlcnMuY29tLDIwMjU6bmV3c21sX1JDMlc5REE0WUtaMQ'],['label'=>'Xinhua','url'=>'https://arabic.news.cn/20251228/eb603bcec09f47d1a872f0ee5d4edaa5/c.html']]],
            ['years'=>'2024 — Present','org'=>'Ana Sooria TV','role_en'=>'Reporter','role_ar'=>'مراسل','bullets_en'=>['Television reporting and live broadcasts','Breaking news coverage and human-interest stories'],'bullets_ar'=>['تغطية تلفزيونية وبث مباشر','تغطية الأخبار العاجلة'],'links'=>[['label'=>'Report 1','url'=>'https://www.youtube.com/watch?v=PhL3R_hAyDo'],['label'=>'Report 2','url'=>'https://www.youtube.com/watch?v=qFJTfyLx-q0'],['label'=>'Report 3','url'=>'https://www.youtube.com/watch?v=_iH24Y8Ev-A']]],
            ['years'=>'2022 — 2024','org'=>'Alghad TV','role_en'=>'Journalist & Field Correspondent','role_ar'=>'صحفي ومراسل ميداني','bullets_en'=>['Television reporting and live coverage','Political, social, and human-interest reporting'],'bullets_ar'=>['تغطية تلفزيونية وبث مباشر','تغطية سياسية واجتماعية'],'links'=>[['label'=>'Report 1','url'=>'https://www.youtube.com/watch?v=x_Y5GXrGxLE'],['label'=>'Report 2','url'=>'https://www.youtube.com/watch?v=xsDjCgYjtmU']]],
            ['years'=>'2020 — 2024','org'=>'Syrian News Channel','role_en'=>'News Anchor, Reporter & Program Presenter','role_ar'=>'مذيع ومراسل ومقدم برامج','bullets_en'=>['Host of Al-Badil (The Alternative) program','News anchoring, live presentation, field and studio reporting'],'bullets_ar'=>['تقديم برنامج "البديل"','تقديم نشرات إخبارية وبث مباشر'],'links'=>[['label'=>'Al-Badil Ep. 1','url'=>'https://www.youtube.com/watch?v=lo-Yae8_Vsw'],['label'=>'Al-Badil Ep. 2','url'=>'https://www.youtube.com/watch?v=urbcgLvUYjE']]],
            ['years'=>'2020 — 2022','org'=>'Cham Times Media Network','role_en'=>'Editor-in-Chief','role_ar'=>'رئيس تحرير','bullets_en'=>['Editorial leadership and newsroom management','Content strategy and team supervision'],'bullets_ar'=>['قيادة تحريرية وإدارة غرفة الأخبار','استراتيجية المحتوى'],'links'=>[]],
            ['years'=>'2012 — 2015','org'=>'Sama TV','role_en'=>'Editor','role_ar'=>'محرر','bullets_en'=>['News editing and editorial production','Television newsroom operations'],'bullets_ar'=>['تحرير الأخبار والإنتاج التحريري','عمليات غرفة الأخبار'],'links'=>[]],
        ];
        foreach ($exp as $i => $e) Experience::firstOrCreate(['org'=>$e['org'],'years'=>$e['years']],array_merge($e,['sort_order'=>$i]));

        // Articles
        $articles = [
            ['pub'=>'Raseef22','title_en'=>'Youssef Guards His Village in Dahok — Alone, After Everyone Left','title_ar'=>'يوسف يحرس قريته في دهوك — وحيداً، بعد رحيل الجميع','excerpt_en'=>'A human story of abandonment, resilience, and the weight of staying when everyone else has gone.','excerpt_ar'=>'قصة إنسانية عن الهجران والصمود.'],
            ['pub'=>'Raseef22','title_en'=>"The Poverty Oven — Latakia Mountain Residents Work for Others' Comfort",'title_ar'=>'فرن الفقر لم يعد كذلك','excerpt_en'=>'An economic field story on how mountain communities survive.','excerpt_ar'=>'قصة اقتصادية ميدانية.'],
            ['pub'=>'Raseef22','title_en'=>'No Voice But the Voice of Criticism — Syria Cuts Support from Social Classes','title_ar'=>'لا صوت يعلو فوق صوت النقد','excerpt_en'=>'Reporting on economic and social policy shifts amid political change in Syria.','excerpt_ar'=>'تغطية للتحولات في السياسة الاقتصادية والاجتماعية.'],
            ['pub'=>'The Cradle','title_en'=>'Articles Archive — The Cradle Arabic','title_ar'=>'أرشيف المقالات — ذا كريدل بالعربية','excerpt_en'=>'Contributing writer covering Syrian affairs and regional geopolitics.','excerpt_ar'=>'كاتب مساهم يغطي الشأن السوري.'],
        ];
        foreach ($articles as $i => $a) Article::firstOrCreate(['title_en'=>$a['title_en']],array_merge($a,['sort_order'=>$i]));

        // About
        AboutContent::firstOrCreate([],[
            'bio_en'=>['For more than fourteen years, I have worked across different areas of journalism — television reporting, news anchoring, editorial leadership, photojournalism, and multimedia storytelling.','Throughout my career, I have covered major political developments, conflicts, humanitarian crises, and social issues across Syria, Lebanon, and Iraq. My work has appeared through local, regional, and international media organizations.','In addition to journalism, I have studied English Translation, Politics, and International Relations, and have completed extensive professional training in journalism, verification, human rights, safety, and media development.'],
            'bio_ar'=>['على مدى أكثر من أربعة عشر عاماً، عملت في مجالات مختلفة من الصحافة.','خلال مسيرتي، غطّيت تطورات سياسية كبرى ونزاعات وأزمات إنسانية وقضايا اجتماعية عبر سوريا ولبنان والعراق.','إضافة إلى الصحافة، درست الترجمة الإنكليزية والعلوم السياسية والعلاقات الدولية.'],
            'skills_en'=>['Field Reporting & Live Broadcasting','Conflict & Crisis Reporting','News Production & Editorial Management','News Anchoring','Multimedia Storytelling','Photojournalism','Fact-Checking & Verification','Team Leadership'],
            'skills_ar'=>['التغطية الميدانية والبث المباشر','تغطية النزاعات والأزمات','الإنتاج الإخباري والإدارة التحريرية','تقديم النشرات الإخبارية','السرد متعدد الوسائط','التصوير الصحفي','التحقق من المعلومات','قيادة الفريق'],
        ]);

        // Certifications
        $certs = [
            ['name_en'=>'HEFAT — Hostile Environment First Aid','name_ar'=>'HEFAT — الإسعافات الأولية في البيئات الخطرة','org_en'=>'Samir Kassir Foundation','org_ar'=>'مؤسسة سمير قصير'],
            ['name_en'=>'AI-Generated Content Verification','name_ar'=>'التحقق من المحتوى المولّد بالذكاء الاصطناعي','org_en'=>'AFP','org_ar'=>'AFP'],
            ['name_en'=>'Information Verification','name_ar'=>'التحقق من المعلومات','org_en'=>'Sawab Platform','org_ar'=>'منصة سواب'],
            ['name_en'=>'Train the Trainers','name_ar'=>'تدريب المدربين','org_en'=>'DW Akademie','org_ar'=>'DW Akademie'],
            ['name_en'=>'Data Journalism','name_ar'=>'صحافة البيانات','org_en'=>'Friedrich Naumann Foundation','org_ar'=>'مؤسسة فريدريش ناومان'],
            ['name_en'=>'International Human Rights Course','name_ar'=>'دورة حقوق الإنسان الدولية','org_en'=>'Jinan University · IIHR','org_ar'=>'جامعة الجنان · IIHR'],
            ['name_en'=>'Social Media Solutions','name_ar'=>'حلول وسائل التواصل الاجتماعي','org_en'=>'ICFJ · SMEX','org_ar'=>'ICFJ · SMEX'],
            ['name_en'=>'News and Program Presentation','name_ar'=>'تقديم الأخبار والبرامج','org_en'=>'Syrian International Academy','org_ar'=>'الأكاديمية السورية الدولية'],
        ];
        foreach ($certs as $i => $c) Certification::firstOrCreate(['name_en'=>$c['name_en']],array_merge($c,['sort_order'=>$i]));
    }
}
