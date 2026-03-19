// app/privacy-policy/page.tsx or components/PrivacyContent.tsx
import React from "react";

// This component displays the Privacy Policy content, styled with Tailwind CSS.
export default function PrivacyContent() {
  return (
    <div className="py-2 px-1 bg-white text-[#38464d] font-sans">
      {/* Main Wrapper equivalent */}
      <div className="max-w-4xl mx-auto">
        {/* Title equivalent */}
        <h1 className="text-2xl font-bold mb-4">Website Privacy Policy</h1>

        {/* LastUpdate equivalent */}
        <p className="text-base md:text-lg  pb-4 border-bborder-[#38464d] ">
          Last updated June 30, 2025
        </p>

        {/* INTRODUCTION SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-7 mb-6">
          INTRODUCTION
        </p>
        {/* Text content */}
        <p className="text-base leading-relaxed text-justify mb-5">
          Plentiful Knowledge Corporation (“we” or “us” or “our”) respects the
          privacy of our users (“user” or “you”). This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          visit our website&nbsp;
          <i className="italic">www.Plentiful Knowledge.com</i>&nbsp;and our
          mobile application, including any other media form, media channel,
          mobile website, or mobile application related or connected thereto
          (collectively, the “Site”). Please read this privacy policy
          carefully.&nbsp;&nbsp;If you do not agree with the terms of this
          privacy policy, please do not access the site.&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We reserve the right to make changes to this Privacy Policy at any
          time and for any reason.&nbsp;&nbsp;We will alert you about any
          changes by updating the “Last Updated” date of this Privacy
          Policy.&nbsp;&nbsp;Any changes or modifications will be effective
          immediately upon posting the updated Privacy Policy on the Site, and
          you waive the right to receive specific notice of each such change or
          modification.&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          You are encouraged to periodically review this Privacy Policy to stay
          informed of updates. You will be deemed to have been made aware of,
          will be subject to, and will be deemed to have accepted the changes in
          any revised Privacy Policy by your continued use of the Site after the
          date such revised Privacy Policy is posted.&nbsp;&nbsp;
        </p>

        {/* COLLECTION OF YOUR INFORMATION SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          COLLECTION OF YOUR INFORMATION
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may collect information about you in a variety of ways. The
          information we may collect on the Site includes:
        </p>

        {/* Personal Data SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Personal Data&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Personally identifiable information, such as your name, shipping
          address, email address, and telephone number, and demographic
          information, such as your age, gender, hometown, and interests, that
          you voluntarily give to us when you register with the Site or our
          mobile application, or when you choose to participate in various
          activities related to the Site and our mobile application, such as
          online chat and message boards. You are under no obligation to provide
          us with personal information of any kind, however your refusal to do
          so may prevent you from using certain features of the Site and our
          mobile application.
        </p>

        {/* Derivative Data SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Derivative Data&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Information our servers automatically collect when you access the
          Site, such as your IP address, your browser type, your operating
          system, your access times, and the pages you have viewed directly
          before and after accessing the Site. If you are using our mobile
          application, this information may also include your device name and
          type, your operating system, your phone number, your country, your
          likes and replies to a post, and other interactions with the
          application and other users via server log files, as well as any other
          information you choose to provide.
        </p>

        {/* Financial Data SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Financial Data&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Financial information, such as data related to your payment method
          (e.g. valid credit card number, card brand, expiration date) that we
          may collect when you purchase, order, return, exchange, or request
          information about our services from the Site or our mobile
          application. We store only very limited, if any, financial information
          that we collect. Otherwise, all financial information is stored by our
          payment processor,&nbsp;&nbsp;and you are encouraged to review their
          privacy policy and contact them directly for responses to your
          questions.
        </p>

        {/* Facebook Permissions SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Facebook Permissions&nbsp;&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          The Site and our mobile application may by default access
          your&nbsp;&nbsp;basic account information, including your name, email,
          gender, birthday, current city, and profile picture URL, as well as
          other information that you choose to make public. We may also request
          access to other permissions related to your account, such as friends,
          checkins, and likes, and you may choose to grant or deny us access to
          each individual permission. For more information regarding Facebook
          permissions, refer to the&nbsp;page.
        </p>

        {/* Data From Social Networks SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Data From Social Networks&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          User information from social networking sites, such as Facebook,
          Instagram, Twitter, LinkedIn, including your name, your social network
          username, location, gender, birth date, email address, profile
          picture, and public data for contacts, if you connect your account to
          such social networks. If you are using our mobile application, this
          information may also include the contact information of anyone you
          invite to use and/or join our mobile application.
        </p>

        {/* Mobile Device Data SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Mobile Device Data&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Device information, such as your mobile device ID, model, and
          manufacturer, and information about the location of your device, if
          you access the Site from a mobile device.
        </p>

        {/* Third-Party Data SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Third-Party Data&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Information from third parties, such as personal information or
          network friends, if you connect your account to the third party and
          grant the Site permission to access this information.
        </p>

        {/* Data From Contests, Giveaways, and Surveys SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Data From Contests, Giveaways, and Surveys&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Personal and other information you may provide when entering contests
          or giveaways and/or responding to surveys.
        </p>

        {/* Mobile Application Information SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Mobile Application Information
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If you connect using our mobile application:
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (1) <i className="italic">Geo-Location Information.</i> We may request
          access or permission to and track location-based information from your
          mobile device, either continuously or while you are using our mobile
          application, to provide location-based services. If you wish to change
          our access or permissions, you may do so in your device’s settings.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (2) <i className="italic">Mobile Device Access.</i> We may request
          access or permission to certain features from your mobile device,
          including your mobile device’s bluetooth, calendar, camera, contacts,
          microphone, reminders, sensors, SMS messages, social media accounts,
          storage, and other features.&nbsp;If you wish to change our access or
          permissions, you may do so in your device’s settings.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (3) <i className="italic">Mobile Device Data.</i> We may collect
          device information (such as your mobile device ID, model and
          manufacturer), operating system, version information and IP address.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (4) <i className="italic">Push Notifications.&nbsp;</i> We may request
          to send you push notifications regarding your account or the
          Application. If you wish to opt-out from receiving these types of
          communications, you may turn them off in your device’s settings.
        </p>

        {/* USE OF YOUR INFORMATION SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          USE OF YOUR INFORMATION&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Having accurate information about you permits us to provide you with a
          smooth, efficient, and customized experience.&nbsp;&nbsp;Specifically,
          we may use information collected about you via the Site or our mobile
          application to:&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (1) Administer sweepstakes, promotions, and contests.&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (2) Assist law enforcement and respond to subpoena.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (3) Compile anonymous statistical data and analysis for use internally
          or with third parties.&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (4) Create and manage your account.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (5) Deliver targeted advertising, coupons, newsletters, and other
          information regarding promotions and the Site and our mobile
          application to you.&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (6) Email you regarding your account or order.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (7) Enable user-to-user communications.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (8) Fulfill and manage purchases, orders, payments, and other
          transactions related to the Site and our mobile application.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (9) Generate a personal profile about you to make future visits to the
          Site and our mobile application more personalized.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (10) Increase the efficiency and operation of the Site and our mobile
          application.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (11) Monitor and analyze usage and trends to improve your experience
          with the Site and our mobile application.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (12) Notify you of updates to the Site and our mobile applications.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (13) Offer new products, services, mobile applications, and/or
          recommendations to you.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (14) Perform other business activities as needed.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (15) Prevent fraudulent transactions, monitor against theft, and
          protect against criminal activity.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (16) Process payments and refunds.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (17) Request feedback and contact you about your use of the Site and
          our mobile application.&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (18) Resolve disputes and troubleshoot problems.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (19) Respond to product and customer service requests.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (20) Send you a newsletter.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (21) Solicit support for the Site and our mobile application.
        </p>

        {/* DISCLOSURE OF YOUR INFORMATION SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          DISCLOSURE OF YOUR INFORMATION
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may share information we have collected about you in certain
          situations. Your information may be disclosed as follows:&nbsp;&nbsp;
        </p>

        {/* By Law or to Protect Rights SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          By Law or to Protect Rights&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If we believe the release of information about you is necessary to
          respond to legal process, to investigate or remedy potential
          violations of our policies, or to protect the rights, property, and
          safety of others, we may share your information as permitted or
          required by any applicable law, rule, or regulation.&nbsp;&nbsp;This
          includes exchanging information with other entities for fraud
          protection and credit risk reduction.
        </p>

        {/* Third-Party Service Providers SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Third-Party Service Providers&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may share your information with third parties that perform services
          for us or on our behalf, including payment processing, data analysis,
          email delivery, hosting services, customer service, and marketing
          assistance.&nbsp;&nbsp;
        </p>

        {/* Marketing Communications SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Marketing Communications
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          With your consent, or with an opportunity for you to withdraw consent,
          we may share your information with third parties for marketing
          purposes, as permitted by law.
        </p>

        {/* Interactions with Other Users SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Interactions with Other Users&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If you interact with other users of the Site and our mobile
          application, those users may see your name, profile photo, and
          descriptions of your activity, including sending invitations to other
          users, chatting with other users, liking posts, following blogs.&nbsp;
        </p>

        {/* Online Postings SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Online Postings
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          When you post comments, contributions or other content to the Site or
          our mobile applications, your posts may be viewed by all users and may
          be publicly distributed outside the Site and our mobile application in
          perpetuity.&nbsp;
        </p>

        {/* Third-Party Advertisers SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Third-Party Advertisers&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may use third-party advertising companies to serve ads when you
          visit the Site or our mobile application. These companies may use
          information about your visits to the Site and our mobile application
          and other websites that are contained in web cookies in order to
          provide advertisements about goods and services of interest to
          you.&nbsp;
        </p>

        {/* Affiliates SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Affiliates&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may share your information with our affiliates, in which case we
          will require those affiliates to honor this Privacy Policy. Affiliates
          include our parent company and any subsidiaries, joint venture
          partners or other companies that we control or that are under common
          control with us.
        </p>

        {/* Business Partners SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Business Partners&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may share your information with our business partners to offer you
          certain products, services or promotions.&nbsp;
        </p>

        {/* Offer Wall SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Offer Wall&nbsp;&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Our mobile application may display a third-party hosted “offer
          wall.”&nbsp;&nbsp;Such an offer wall allows third-party advertisers to
          offer virtual currency, gifts, or other items to users in return for
          acceptance and completion of an advertisement offer.&nbsp;&nbsp;Such
          an offer wall may appear in our mobile application and be displayed to
          you based on certain data, such as your geographic area or demographic
          information.&nbsp;&nbsp;When you click on an offer wall, you will
          leave our mobile application.&nbsp;&nbsp;A unique identifier, such as
          your user ID, will be shared with the offer wall provider in order to
          prevent fraud and properly credit your account.
        </p>

        {/* Social Media Contacts SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Social Media Contacts&nbsp;&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If you connect to the Site or our mobile application through a social
          network, your contacts on the social network will see your name,
          profile photo, and descriptions of your activity.&nbsp;
        </p>

        {/* Other Third Parties SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Other Third Parties
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may share your information with advertisers and investors for the
          purpose of conducting general business analysis. We may also share
          your information with such third parties for marketing purposes, as
          permitted by law.&nbsp;
        </p>

        {/* TRACKING TECHNOLOGIES SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          TRACKING TECHNOLOGIES
        </p>

        {/* Cookies and Web Beacons SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Cookies and Web Beacons
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may use cookies, web beacons, tracking pixels, and other tracking
          technologies on the Site and our mobile application to help customize
          the Site and our mobile application and improve your experience. When
          you access the Site or our mobile application, your personal
          information is not collected through the use of tracking technology.
          Most browsers are set to accept cookies by default. You can remove or
          reject cookies, but be aware that such action could affect the
          availability and functionality of the Site or our mobile application.
          You may not decline web beacons. However, they can be rendered
          ineffective by declining all cookies or by modifying your web
          browser’s settings to notify you each time a cookie is tendered,
          permitting you to accept or decline cookies on an individual basis.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may use cookies, web beacons, tracking pixels, and other tracking
          technologies on the Site and our mobile application to help customize
          the Site and our mobile application and improve your experience. For
          more information on how we use cookies, please refer to our Cookie
          Policy posted on the Site, which is incorporated into this Privacy
          Policy. By using the Site, you agree to be bound by our Cookie Policy.
        </p>

        {/* Internet-Based Advertising SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Internet-Based Advertising
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Additionally, we may use third-party software to serve ads on the Site
          and our mobile application, implement email marketing campaigns, and
          manage other interactive marketing initiatives.&nbsp;&nbsp;This
          third-party software may use cookies or similar tracking technology to
          help manage and optimize your online experience with
          us.&nbsp;&nbsp;For more information about opting-out of interest-based
          ads, visit the&nbsp;&nbsp;or&nbsp;.
        </p>

        {/* Website Analytics SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Website Analytics&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We may also partner with selected third-party vendors, such as&nbsp;,
          and others, to allow tracking technologies and remarketing services on
          the Site and our mobile application through the use of first party
          cookies and third-party cookies, to, among other things, analyze and
          track users’ use of the Site and our mobile application, determine the
          popularity of certain content and better understand online activity.
          By accessing the Site ,our mobile application, you consent to the
          collection and use of your information by these third-party vendors.
          You are encouraged to review their privacy policy&nbsp;and contact
          them directly for responses to your questions. We do not transfer
          personal information to these third-party vendors.&nbsp;However, if
          you do not want any information to be collected and used by tracking
          technologies, you can visit the third-party vendor or
          the&nbsp;&nbsp;or&nbsp;.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          You should be aware that getting a new computer, installing a new
          browser, upgrading an existing browser, or erasing or otherwise
          altering your browser’s cookies files may also clear certain opt-out
          cookies, plug-ins, or settings.
        </p>

        {/* THIRD-PARTY WEBSITES SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          THIRD-PARTY WEBSITES
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          The Site and our mobile application may contain links to third-party
          websites and applications of interest, including advertisements and
          external services, that are not affiliated with us. Once you have used
          these links to leave the Site or our mobile application, any
          information you provide to these third parties is not covered by this
          Privacy Policy, and we cannot guarantee the safety and privacy of your
          information. Before visiting and providing any information to any
          third-party websites, you should inform yourself of the privacy
          policies and practices (if any) of the third party responsible for
          that website, and should take those steps necessary to, in your
          discretion, protect the privacy of your information. We are not
          responsible for the content or privacy and security practices and
          policies of any third parties, including other sites, services or
          applications that may be linked to or from the Site or our mobile
          application.
        </p>

        {/* SECURITY OF YOUR INFORMATION SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          SECURITY OF YOUR INFORMATION
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We use administrative, technical, and physical security measures to
          help protect your personal information.&nbsp;&nbsp;While we have taken
          reasonable steps to secure the personal information you provide to us,
          please be aware that despite our efforts, no security measures are
          perfect or impenetrable, and no method of data transmission can be
          guaranteed against any interception or other type of
          misuse.&nbsp;&nbsp;Any information disclosed online is vulnerable to
          interception and misuse by unauthorized parties. Therefore, we cannot
          guarantee complete security if you provide personal information.
        </p>

        {/* POLICY FOR CHILDREN SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          POLICY FOR CHILDREN
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          We do not knowingly solicit information from or market to children
          under the age of 13. If you become aware of any data we have collected
          from children under age 13, please contact us using the contact
          information provided below.&nbsp;
        </p>

        {/* CONTROLS FOR DO-NOT-TRACK FEATURES SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          CONTROLS FOR DO-NOT-TRACK FEATURES&nbsp;&nbsp;
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Most web browsers and some mobile operating systems and our mobile
          applications include a Do-Not-Track (“DNT”) feature or setting you can
          activate to signal your privacy preference not to have data about your
          online browsing activities monitored and collected.&nbsp;&nbsp;No
          uniform technology standard for recognizing and implementing DNT
          signals has been finalized. As such, we do not currently respond to
          DNT browser signals or any other mechanism that automatically
          communicates your choice not to be tracked online.&nbsp;&nbsp;If a
          standard for online tracking is adopted that we must follow in the
          future, we will inform you about that practice in a revised version of
          this Privacy Policy. Most web browsers and some mobile operating
          systems and our mobile applications include a Do-Not-Track (“DNT”)
          feature or setting you can activate to signal your privacy preference
          not to have data about your online browsing activities monitored and
          collected. If you set the DNT signal on your browser, we will respond
          to such DNT browser signals.&nbsp;
        </p>

        {/* OPTIONS REGARDING YOUR INFORMATION SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          OPTIONS REGARDING YOUR INFORMATION
        </p>

        {/* Account Information SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Account Information
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          You may at any time review or change the information in your account
          or terminate your account by:
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (1) Logging into your account settings and updating your account
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (2) Contacting us using the contact information provided below
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
          However, some information may be retained in our files to prevent
          fraud, troubleshoot problems, assist with any investigations, enforce
          our Terms of Use and/or comply with legal requirements.
        </p>

        {/* Emails and Communications SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          Emails and Communications
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If you no longer wish to receive correspondence, emails, or other
          communications from us, you may opt-out by:
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (1) Noting your preferences at the time you register your account with
          the Site or our mobile application
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (2) Logging into your account settings and updating your preferences.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          (3) Contacting us using the contact information provided below
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If you no longer wish to receive correspondence, emails, or other
          communications from third parties, you are responsible for contacting
          the third party directly.&nbsp;
        </p>

        {/* CALIFORNIA PRIVACY RIGHTS SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          CALIFORNIA PRIVACY RIGHTS
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          California Civil Code Section 1798.83, also known as the “Shine The
          Light” law, permits our users who are California residents to request
          and obtain from us, once a year and free of charge, information about
          categories of personal information (if any) we disclosed to third
          parties for direct marketing purposes and the names and addresses of
          all third parties with which we shared personal information in the
          immediately preceding calendar year. If you are a California resident
          and would like to make such a request, please submit your request in
          writing to us using the contact information provided below.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If you are under 18 years of age, reside in California, and have a
          registered account with the Site or our mobile application, you have
          the right to request removal of unwanted data that you publicly post
          on the Site or our mobile application. To request removal of such
          data, please contact us using the contact information provided below,
          and include the email address associated with your account and a
          statement that you reside in California.&nbsp;&nbsp;We will make sure
          the data is not publicly displayed on the Site or our mobile
          application, but please be aware that the data may not be completely
          or comprehensively removed from our systems.
        </p>

        {/* CONTACT US SubTitle */}
        <p className="text-xl md:text-2xl font-semibold text-left mt-12 mb-6">
          CONTACT US
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          If you have questions or comments about this Privacy Policy, please
          contact us at:
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Plentiful Knowledge, Inc.
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Attn: Copyright Agent
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          2999 Douglas Blvd, Suite 180
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          Roseville, CA. 95661
        </p>
        <p className="text-base leading-relaxed text-justify mb-5">
          <a
            href="mailto:Business@PlentifulKnowledge.com"
            className="text-blue-600 hover:underline"
          >
            Send E-mail
          </a>
        </p>
      </div>
    </div>
  );
}
