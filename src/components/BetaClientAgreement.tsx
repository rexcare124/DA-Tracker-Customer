"use client";

import React from "react";

const BetaCleintAgreement: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Beta Client Agreement</h1>
      <p className="mb-4">
        This Beta Agreement (“Beta Agreement”) is entered into by the Client set
        forth below or as indicated in a separate writing incorporating these
        terms (the “Client”) and Plentiful Knowledge, Inc. and its affiliates
        and subsidiaries (collectively, “Plentiful Knowledge”). This Beta
        Agreement governs your access to and use of certain software and related
        services (the “Beta Services”) offered by Plentiful Knowledge solely for
        testing and evaluation purposes.
      </p>
      <p className="mb-4">
        By accessing or using the Beta Services, you agree to be bound by this
        Beta Agreement and accept all of its terms. If you do not accept all the
        terms of this Beta Agreement, then you may not use the Beta Services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Terms of Use</h2>
      <p className="mb-4">
        Client acknowledges and agrees that access and use of the Beta Services
        will be subject to Plentiful Knowledge’s product specific terms
        (accessible at www.PlentifulKnowledge.com/Terms), incorporated herein by
        reference...
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Acknowledgment of Beta Services Limitations
      </h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          The Beta Services have not been made commercially available by
          Plentiful Knowledge.
        </li>
        <li>
          The Beta Services may not operate properly, be in final form or fully
          functional.
        </li>
        <li>
          The Beta Services may contain errors, design flaws or other problems.
        </li>
        <li>
          Use may result in unexpected results, data corruption, or other
          unpredictable issues.
        </li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Client will not:</h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Use the Beta Services to promote illegal or immoral activities.</li>
        <li>
          Disassemble, decompile, reverse engineer, or make derivative works.
        </li>
        <li>
          Disclose the Beta Services to any third party except as permitted.
        </li>
        <li>
          Violate any applicable laws or regulations in use of the Beta
          Services.
        </li>
        <li>Provide unauthorized data or content to the Beta Services.</li>
        <li>Use the Beta Services to develop a competing product.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Artificial Intelligence (AI)
      </h2>
      <p className="mb-4">
        Client acknowledges and agrees that the Beta Services may include AI/ML
        features and Plentiful Knowledge may collect data from Client
        interactions to improve the Beta Services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">No Warranty</h2>
      <p className="mb-4 italic">
        BETA SERVICES ARE PROVIDED “AS IS.” Plentiful Knowledge disclaims all
        warranties, express or implied...
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Limitation of Liability
      </h2>
      <p className="mb-4">
        Under no circumstances will Plentiful Knowledge be liable for any direct
        or indirect damages arising from use of the Beta Services...
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Confidentiality</h2>
      <p className="mb-4">
        Client agrees all Beta-related information is confidential and must not
        be disclosed to third parties without court order. All materials must be
        returned or destroyed upon termination.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">General</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          Governing law is based on the state of the public entity (if
          applicable).
        </li>
        <li>Client may not assign this agreement without written consent.</li>
        <li>If any provision is held invalid, the rest remains in effect.</li>
        <li>
          Delays due to uncontrollable causes will not be considered defaults.
        </li>
        <li>
          Beta Services are free during testing; commercial version may be
          purchased later.
        </li>
      </ul>
    </div>
  );
};

export default BetaCleintAgreement;
