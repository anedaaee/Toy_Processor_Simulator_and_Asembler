library ieee;
use ieee.STD_LOGIC_1164.all;


entity Mux_8 is 
	generic (au_bw : integer := 16);
	port (
		input_0 ,input_1 ,input_2 ,input_3 ,input_4 ,input_5 ,input_6 ,input_7 : in std_logic_vector(au_bw - 1 downto 0) := (others => '0');
		sel : in std_logic_vector(2 downto 0) := (others => '0');
		clk : in std_logic := '0';
		output : out std_logic_vector(au_bw - 1 downto 0) := (others => '0')
	);
end Mux_8;


architecture Behavioral of Mux_8 is

begin
	process(input_0 ,input_1 ,input_2 ,input_3 ,input_4 ,input_5 ,input_6 ,input_7,sel)

	begin
		--if (clk'EVENT and clk = '1') then
			case sel is
				when "000" => output <= input_0;
				when "001" => output <= input_1;
				when "010" => output <= input_2;
				when "011" => output <= input_3;
				when "100" => output <= input_4;
				when "101" => output <= input_5;
				when "110" => output <= input_6;
				when "111" => output <= input_7;
				when others => output <= (others => '0');
			end case;		
		--end if;
	end process;


end Behavioral;
