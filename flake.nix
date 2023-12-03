{
  description = "kanbas";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/master";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShell = pkgs.mkShell {
        name = "kanbas";
        buildInputs = with pkgs; [
          nodejs_18
        ];
        shellHook = ''
          export PATH=$PWD/node_modules/.bin:$PATH
        '';
        NODE_ENV = "development";
        FRONTEND_URL = "http://localhost:3000";
      };
    });
}
